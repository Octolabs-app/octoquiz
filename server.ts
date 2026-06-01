import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'
import { networkInterfaces } from 'os'
import type { ServerToClientEvents, ClientToServerEvents, Room } from './lib/types'
import * as rm from './lib/room-manager'
import { createTriviaGame, startQuestion, submitTriviaAnswer, calculateTriviaPoints, updateStreaks, eliminateWrongAnswers, isSuddenDeathOver, advanceTriviaQuestion, revealTriviaAnswer, showTriviaLeaderboard } from './lib/games/trivia'
import type { TriviaConfig } from './lib/types'
import { createFlagQuizGame, startFlagQuestion, submitFlagAnswer, calculateFlagPoints, advanceFlagQuestion, revealFlagAnswer, showFlagLeaderboard } from './lib/games/flag-quiz'
import { createImposterGame, startDiscussion, startVoting, submitVote, resolveVotes, nextImposterRound } from './lib/games/imposter'
import { createCapitalsGame, startCapitalsQuestion, submitCapitalsAnswer, calculateCapitalsPoints, advanceCapitalsQuestion, revealCapitalsAnswer, showCapitalsLeaderboard } from './lib/games/capitals'
import { createLandmarksGame, startLandmarksQuestion, submitLandmarksAnswer, calculateLandmarksPoints, advanceLandmarksQuestion, revealLandmarksAnswer, showLandmarksLeaderboard } from './lib/games/landmarks'

const dev  = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT ?? '3000', 10)

// ─── Access control ───────────────────────────────────────────────────────────
// SITE_PASSWORD gates the entire deployment behind HTTP Basic Auth. Set it as an
// env var on Render so the public URL is unusable without the password. If it is
// unset (e.g. local dev) the gate is disabled. Username is ignored; only the
// password is checked.
const SITE_PASSWORD = process.env.SITE_PASSWORD ?? ''
const AUTH_ENABLED  = SITE_PASSWORD.length > 0

// Fail closed: in production the password is mandatory. If it's missing we serve
// 503 for everything so the public URL is never usable by accident.
const LOCKED_NO_PASSWORD = !dev && !AUTH_ENABLED

function timingSafeEqual(a: string, b: string): boolean {
  // Constant-time-ish compare to avoid leaking length/character timing.
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return mismatch === 0
}

function isAuthorized(authHeader: string | undefined): boolean {
  if (!AUTH_ENABLED) return true
  if (!authHeader?.startsWith('Basic ')) return false
  try {
    const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8')
    const pass = decoded.slice(decoded.indexOf(':') + 1)
    return timingSafeEqual(pass, SITE_PASSWORD)
  } catch {
    return false
  }
}

const app    = next({ dev })
const handle = app.getRequestHandler()

function getLocalIP(): string {
  const nets = networkInterfaces()
  for (const ifaces of Object.values(nets)) {
    for (const iface of ifaces ?? []) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address
    }
  }
  return 'localhost'
}

function toPublic(room: Room) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hostId, ...pub } = room
  return pub
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    const pathname = parsedUrl.pathname ?? ''

    // ── Health check — must bypass the password gate. Render pings this to
    //    decide if the deploy is healthy; if it 401'd here the deploy would be
    //    marked unhealthy and never go live. ──
    if (pathname === '/healthz') {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('ok')
      return
    }

    // ── Fail closed if no password configured in production ──
    if (LOCKED_NO_PASSWORD) {
      res.writeHead(503, { 'Content-Type': 'text/plain' })
      res.end('Site is not configured (SITE_PASSWORD env var is required).')
      return
    }

    // ── Password gate (Basic Auth) ──
    if (!isAuthorized(req.headers.authorization)) {
      res.writeHead(401, {
        'WWW-Authenticate': 'Basic realm="QuizBlast", charset="UTF-8"',
        'Content-Type': 'text/plain',
      })
      res.end('Authentication required')
      return
    }

    // ── After Dark is APK-only — never serve /couples on the hosted site (prod only) ──
    if (!dev && (pathname === '/couples' || pathname.startsWith('/couples/'))) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not found')
      return
    }

    handle(req, res, parsedUrl)
  })

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: { origin: '*' },
    // Gate the WebSocket/polling handshake behind the same password so the
    // multiplayer backend can't be reached without it either.
    allowRequest: (req, callback) => {
      callback(null, !LOCKED_NO_PASSWORD && isAuthorized(req.headers.authorization))
    },
  })

  // Auto-timers per room
  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  function clearTimer(code: string) {
    const t = timers.get(code)
    if (t) { clearTimeout(t); timers.delete(code) }
  }

  function setTimer(code: string, ms: number, fn: () => void) {
    clearTimer(code)
    timers.set(code, setTimeout(fn, ms))
  }

  function broadcast(code: string) {
    const room = rm.getRoom(code)
    if (room) io.to(code).emit('room_state', toPublic(room))
  }

  function broadcastGame(code: string) {
    const room = rm.getRoom(code)
    if (room?.gameState) io.to(code).emit('game_state', room.gameState)
  }

  // ─── Trivia flow ────────────────────────────────────────────────────────────
  function triviaStartQuestion(code: string) {
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'trivia') return
    const state = startQuestion(room.gameState)
    rm.setGameState(code, state)
    broadcastGame(code)

    setTimer(code, state.timeLimit * 1000, () => triviaReveal(code))
  }

  function triviaReveal(code: string) {
    clearTimer(code)
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'trivia') return

    const playerIds = room.players.map(p => p.id)
    const pts       = calculateTriviaPoints(room.gameState, playerIds)
    rm.addPoints(code, pts)

    // Update streaks → then eliminate wrong-answerers (sudden-death)
    let state = updateStreaks(room.gameState, playerIds)
    state     = eliminateWrongAnswers(state, playerIds)
    const revealed = revealTriviaAnswer(state)
    rm.setGameState(code, revealed)
    broadcast(code)
    broadcastGame(code)

    // In sudden-death, if ≤1 player active → skip leaderboard, go straight to finish
    if (isSuddenDeathOver(revealed, playerIds)) {
      setTimer(code, 3000, () => {
        const r = rm.getRoom(code)
        if (!r?.gameState || r.gameState.game !== 'trivia') return
        rm.setGameState(code, { ...r.gameState, phase: 'finished' })
        broadcastGame(code)
        setTimer(code, 1500, () => { rm.setRoomStatus(code, 'results'); broadcast(code) })
      })
      return
    }

    setTimer(code, 3500, () => triviaLeaderboard(code))
  }

  function triviaLeaderboard(code: string) {
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'trivia') return
    const lb = showTriviaLeaderboard(room.gameState)
    rm.setGameState(code, lb)
    broadcastGame(code)
    broadcast(code)

    setTimer(code, 4000, () => triviaNextQuestion(code))
  }

  function triviaNextQuestion(code: string) {
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'trivia') return
    const next = advanceTriviaQuestion(room.gameState)
    rm.setGameState(code, next)
    broadcastGame(code)

    if (next.phase === 'finished') {
      rm.setRoomStatus(code, 'results')
      broadcast(code)
      return
    }
    setTimer(code, 2000, () => triviaStartQuestion(code))
  }

  // ─── Flag Quiz flow ─────────────────────────────────────────────────────────
  function flagStartQuestion(code: string) {
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'flag-quiz') return
    const state = startFlagQuestion(room.gameState)
    rm.setGameState(code, state)
    broadcastGame(code)
    setTimer(code, state.timeLimit * 1000, () => flagReveal(code))
  }

  function flagReveal(code: string) {
    clearTimer(code)
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'flag-quiz') return
    const pts = calculateFlagPoints(room.gameState, room.players.map(p => p.id))
    rm.addPoints(code, pts)
    const revealed = revealFlagAnswer(room.gameState)
    rm.setGameState(code, revealed)
    broadcast(code)
    broadcastGame(code)
    setTimer(code, 3500, () => flagLeaderboard(code))
  }

  function flagLeaderboard(code: string) {
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'flag-quiz') return
    const lb = showFlagLeaderboard(room.gameState)
    rm.setGameState(code, lb)
    broadcastGame(code)
    broadcast(code)
    setTimer(code, 4000, () => flagNextQuestion(code))
  }

  function flagNextQuestion(code: string) {
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'flag-quiz') return
    const next = advanceFlagQuestion(room.gameState)
    rm.setGameState(code, next)
    broadcastGame(code)
    if (next.phase === 'finished') {
      rm.setRoomStatus(code, 'results')
      broadcast(code)
      return
    }
    setTimer(code, 2000, () => flagStartQuestion(code))
  }

  // ─── Capitals flow ──────────────────────────────────────────────────────────
  function capitalsStartQuestion(code: string) {
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'capitals') return
    const state = startCapitalsQuestion(room.gameState)
    rm.setGameState(code, state); broadcastGame(code)
    setTimer(code, state.timeLimit * 1000, () => capitalsReveal(code))
  }
  function capitalsReveal(code: string) {
    clearTimer(code)
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'capitals') return
    const pts = calculateCapitalsPoints(room.gameState, room.players.map(p => p.id))
    rm.addPoints(code, pts)
    rm.setGameState(code, revealCapitalsAnswer(room.gameState))
    broadcast(code); broadcastGame(code)
    setTimer(code, 3500, () => capitalsLeaderboard(code))
  }
  function capitalsLeaderboard(code: string) {
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'capitals') return
    rm.setGameState(code, showCapitalsLeaderboard(room.gameState))
    broadcastGame(code); broadcast(code)
    setTimer(code, 4000, () => capitalsNext(code))
  }
  function capitalsNext(code: string) {
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'capitals') return
    const next = advanceCapitalsQuestion(room.gameState)
    rm.setGameState(code, next); broadcastGame(code)
    if (next.phase === 'finished') { rm.setRoomStatus(code, 'results'); broadcast(code); return }
    setTimer(code, 2000, () => capitalsStartQuestion(code))
  }

  // ─── Landmarks flow ─────────────────────────────────────────────────────────
  function landmarksStartQuestion(code: string) {
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'landmarks') return
    const state = startLandmarksQuestion(room.gameState)
    rm.setGameState(code, state); broadcastGame(code)
    setTimer(code, state.timeLimit * 1000, () => landmarksReveal(code))
  }
  function landmarksReveal(code: string) {
    clearTimer(code)
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'landmarks') return
    const pts = calculateLandmarksPoints(room.gameState, room.players.map(p => p.id))
    rm.addPoints(code, pts)
    rm.setGameState(code, revealLandmarksAnswer(room.gameState))
    broadcast(code); broadcastGame(code)
    setTimer(code, 3500, () => landmarksLeaderboard(code))
  }
  function landmarksLeaderboard(code: string) {
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'landmarks') return
    rm.setGameState(code, showLandmarksLeaderboard(room.gameState))
    broadcastGame(code); broadcast(code)
    setTimer(code, 4000, () => landmarksNext(code))
  }
  function landmarksNext(code: string) {
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'landmarks') return
    const next = advanceLandmarksQuestion(room.gameState)
    rm.setGameState(code, next); broadcastGame(code)
    if (next.phase === 'finished') { rm.setRoomStatus(code, 'results'); broadcast(code); return }
    setTimer(code, 2000, () => landmarksStartQuestion(code))
  }

  // ─── Imposter flow ──────────────────────────────────────────────────────────
  function imposterStartDiscussion(code: string) {
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'imposter') return
    const state = startDiscussion(room.gameState)
    rm.setGameState(code, state)
    broadcastGame(code)
    setTimer(code, state.discussionSeconds * 1000, () => imposterOpenVoting(code))
  }

  function imposterOpenVoting(code: string) {
    clearTimer(code)
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'imposter') return
    const state = startVoting(room.gameState)
    rm.setGameState(code, state)
    broadcastGame(code)
    setTimer(code, 30_000, () => imposterResolve(code))
  }

  function imposterResolve(code: string) {
    clearTimer(code)
    const room = rm.getRoom(code)
    if (!room?.gameState || room.gameState.game !== 'imposter') return
    const { state, points } = resolveVotes(
      room.gameState,
      room.players.map(p => ({ id: p.id, name: p.name })),
    )
    rm.addPoints(code, points)
    rm.setGameState(code, state)
    broadcast(code)
    broadcastGame(code)

    if (state.phase === 'finished') {
      setTimer(code, 5000, () => {
        rm.setRoomStatus(code, 'results')
        broadcast(code)
      })
    } else {
      setTimer(code, 6000, () => {
        const r = rm.getRoom(code)
        if (!r?.gameState || r.gameState.game !== 'imposter') return
        const nextState = nextImposterRound(r.gameState, r.players.map(p => p.id))
        rm.setGameState(code, nextState)
        broadcastGame(code)
        setTimer(code, 5000, () => imposterStartDiscussion(code))
      })
    }
  }

  // ─── Socket handlers ────────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    // ── Host creates room (idempotent — safe to call again on page reload) ──
    socket.on('host_create_room', (cb) => {
      const existing = rm.findRoomBySocket(socket.id)
      if (existing && existing.hostId === socket.id) {
        socket.join(existing.code)
        socket.emit('room_state', toPublic(existing))
        if (existing.gameState) socket.emit('game_state', existing.gameState)
        cb(existing.code)
        return
      }
      const room = rm.createRoom(socket.id)
      socket.join(room.code)
      socket.emit('room_state', toPublic(room))
      cb(room.code)
    })

    // ── Re-request state (useful on page remount) ──
    socket.on('request_state' as never, () => {
      const room = rm.findRoomBySocket(socket.id)
      if (room) {
        socket.emit('room_state', toPublic(room))
        if (room.gameState) socket.emit('game_state', room.gameState)
      }
    })

    // ── Player joins room ──
    socket.on('player_join', (code, name, cb) => {
      const upperCode = code.toUpperCase()
      const room = rm.getRoom(upperCode)
      if (!room) return cb('Room not found', null)
      if (room.status !== 'lobby') return cb('Game already started', null)
      if (room.players.length >= 50) return cb('Room is full', null)
      if (room.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        return cb('Name already taken', null)
      }

      const player = rm.addPlayer(upperCode, { id: socket.id, name })
      if (!player) return cb('Failed to join', null)

      socket.join(upperCode)
      io.to(upperCode).emit('player_joined', player)
      broadcast(upperCode)
      cb(null, toPublic(rm.getRoom(upperCode)!))
    })

    // ── Player marks ready ──
    socket.on('player_ready', () => {
      const room = rm.findRoomBySocket(socket.id)
      if (!room) return
      rm.markPlayerReady(room.code, socket.id, true)
      broadcast(room.code)
    })

    // ── Game master selects game (host TV screen OR first player may select) ──
    socket.on('select_game', (game) => {
      const room = rm.findRoomBySocket(socket.id)
      if (!room) return
      const isHost = socket.id === room.hostId
      const isGM   = socket.id === room.gameMasterId
      if (!isHost && !isGM) return
      rm.setCurrentGame(room.code, game)
      rm.setRoomStatus(room.code, 'game-select')
      broadcast(room.code)
    })

    // ── Start game ──
    socket.on('start_game', async (config?: TriviaConfig) => {
      const room = rm.findRoomBySocket(socket.id)
      if (!room) return
      if (socket.id !== room.gameMasterId && socket.id !== room.hostId) return
      if (!room.currentGame) return
      if (room.players.length < 1) {
        socket.emit('error', 'Need at least 1 player to start')
        return
      }
      if (room.currentGame === 'imposter' && room.players.length < 3) {
        socket.emit('error', 'Imposter needs at least 3 players')
        return
      }

      rm.resetScores(room.code)
      rm.setRoomStatus(room.code, 'playing')

      const playerIds = room.players.map(p => p.id)

      switch (room.currentGame) {
        case 'trivia': {
          const state = await createTriviaGame(config)
          rm.setGameState(room.code, state)
          broadcast(room.code)
          broadcastGame(room.code)
          setTimer(room.code, 2000, () => triviaStartQuestion(room.code))
          break
        }
        case 'flag-quiz': {
          const state = createFlagQuizGame(15)
          rm.setGameState(room.code, state)
          broadcast(room.code)
          broadcastGame(room.code)
          setTimer(room.code, 2000, () => flagStartQuestion(room.code))
          break
        }
        case 'imposter': {
          const state = createImposterGame(playerIds, 3)
          rm.setGameState(room.code, state)
          broadcast(room.code)
          broadcastGame(room.code)
          setTimer(room.code, 5000, () => imposterStartDiscussion(room.code))
          break
        }
        case 'capitals': {
          const state = await createCapitalsGame(12)
          rm.setGameState(room.code, state)
          broadcast(room.code)
          broadcastGame(room.code)
          setTimer(room.code, 2000, () => capitalsStartQuestion(room.code))
          break
        }
        case 'landmarks': {
          const state = await createLandmarksGame(12)
          rm.setGameState(room.code, state)
          broadcast(room.code)
          broadcastGame(room.code)
          setTimer(room.code, 2000, () => landmarksStartQuestion(room.code))
          break
        }
      }
    })

    // ── In-game action ──
    socket.on('game_action', (action) => {
      const room = rm.findRoomBySocket(socket.id)
      if (!room?.gameState) return

      switch (action.type) {
        case 'trivia_answer': {
          if (room.gameState.game !== 'trivia') return
          const state = submitTriviaAnswer(room.gameState, socket.id, action.answerId)
          rm.setGameState(room.code, state)
          broadcastGame(room.code)

          // Early reveal if all ACTIVE (non-eliminated) players answered
          const activePlayers = room.players.filter(p => !state.eliminated.includes(p.id))
          const answered      = activePlayers.filter(p => state.answers[p.id]).length
          if (activePlayers.length > 0 && answered >= activePlayers.length) {
            clearTimer(room.code)
            triviaReveal(room.code)
          }
          break
        }
        case 'flag_answer': {
          if (room.gameState.game !== 'flag-quiz') return
          const state = submitFlagAnswer(room.gameState, socket.id, action.answer)
          rm.setGameState(room.code, state)
          broadcastGame(room.code)

          const answered = Object.keys(state.answers).length
          if (answered >= room.players.length) {
            clearTimer(room.code)
            flagReveal(room.code)
          }
          break
        }
        case 'imposter_vote': {
          if (room.gameState.game !== 'imposter') return
          const state = submitVote(room.gameState, socket.id, action.targetId)
          rm.setGameState(room.code, state)
          broadcastGame(room.code)

          const voted = Object.keys(state.votes).length
          if (voted >= room.players.length) {
            clearTimer(room.code)
            imposterResolve(room.code)
          }
          break
        }
        case 'capitals_answer': {
          if (room.gameState.game !== 'capitals') return
          const state = submitCapitalsAnswer(room.gameState, socket.id, action.answer)
          rm.setGameState(room.code, state); broadcastGame(room.code)
          if (Object.keys(state.answers).length >= room.players.length) { clearTimer(room.code); capitalsReveal(room.code) }
          break
        }
        case 'landmarks_answer': {
          if (room.gameState.game !== 'landmarks') return
          const state = submitLandmarksAnswer(room.gameState, socket.id, action.answer)
          rm.setGameState(room.code, state); broadcastGame(room.code)
          if (Object.keys(state.answers).length >= room.players.length) { clearTimer(room.code); landmarksReveal(room.code) }
          break
        }
      }
    })

    // ── Next round (game master) ──
    socket.on('next_round', () => {
      const room = rm.findRoomBySocket(socket.id)
      if (!room || socket.id !== room.gameMasterId) return
      if (!room?.gameState) return
      // Used for imposter reveal → discussion
      if (room.gameState.game === 'imposter' && room.gameState.phase === 'reveal') {
        imposterStartDiscussion(room.code)
      }
    })

    // ── End game ──
    socket.on('end_game', () => {
      const room = rm.findRoomBySocket(socket.id)
      if (!room) return
      if (socket.id !== room.gameMasterId && socket.id !== room.hostId) return
      clearTimer(room.code)
      rm.setRoomStatus(room.code, 'results')
      broadcast(room.code)
    })

    // ── Kick player (game master only) ──
    socket.on('kick_player', (playerId) => {
      const room = rm.findRoomBySocket(socket.id)
      if (!room || socket.id !== room.gameMasterId) return
      const target = io.sockets.sockets.get(playerId)
      if (target) {
        target.emit('kicked')
        target.leave(room.code)
      }
      rm.removePlayer(playerId)
      broadcast(room.code)
    })

    // ── Disconnect ──
    socket.on('disconnect', () => {
      const result = rm.removePlayer(socket.id)
      if (result) {
        const { room, player } = result
        io.to(room.code).emit('player_left', player.id, player.name)
        broadcast(room.code)
      }

      // If host disconnects, tear down room
      for (const room of [rm.findRoomBySocket(socket.id)].filter(Boolean)) {
        if (room!.hostId === socket.id) {
          clearTimer(room!.code)
          rm.deleteRoom(room!.code)
        }
      }
    })
  })

  httpServer.listen(port, '0.0.0.0', () => {
    const ip = getLocalIP()
    console.log('\n🎮  QuizBlast')
    if (LOCKED_NO_PASSWORD) {
      console.log('   🔒 LOCKED — SITE_PASSWORD not set; serving 503 to everyone.')
    } else if (AUTH_ENABLED) {
      console.log('   🔐 Password gate: ON (HTTP Basic Auth)')
    } else {
      console.log('   🔓 Password gate: OFF (dev mode)')
    }
    console.log(`   Local:   http://localhost:${port}`)
    console.log(`   Network: http://${ip}:${port}`)
    console.log(`\n   TV → open  http://${ip}:${port}`)
    console.log(`   Players → scan QR or go to  http://${ip}:${port}/join\n`)
  })
})
