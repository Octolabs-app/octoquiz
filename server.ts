import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'
import { networkInterfaces } from 'os'
import type { ServerToClientEvents, ClientToServerEvents, Room } from './lib/types'
import * as rm from './lib/room-manager'
import { createTriviaGame, startQuestion, submitTriviaAnswer, calculateTriviaPoints, advanceTriviaQuestion, revealTriviaAnswer, showTriviaLeaderboard } from './lib/games/trivia'
import { createFlagQuizGame, startFlagQuestion, submitFlagAnswer, calculateFlagPoints, advanceFlagQuestion, revealFlagAnswer, showFlagLeaderboard } from './lib/games/flag-quiz'
import { createImposterGame, startDiscussion, startVoting, submitVote, resolveVotes, nextImposterRound } from './lib/games/imposter'
import { createTruthDareGame, playerPicksTD, completeTurn, skipTurn } from './lib/games/truth-or-dare'

const dev  = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT ?? '3000', 10)

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
    handle(req, res, parsedUrl)
  })

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: { origin: '*' },
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

    const pts = calculateTriviaPoints(room.gameState, room.players.map(p => p.id))
    rm.addPoints(code, pts)
    const revealed = revealTriviaAnswer(room.gameState)
    rm.setGameState(code, revealed)
    broadcast(code)
    broadcastGame(code)

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
      if (room.players.length >= 16) return cb('Room is full', null)
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
    socket.on('start_game', () => {
      const room = rm.findRoomBySocket(socket.id)
      if (!room) return
      if (socket.id !== room.gameMasterId && socket.id !== room.hostId) return
      if (!room.currentGame) return
      if (room.players.length < 2) {
        socket.emit('error', 'Need at least 2 players to start')
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
          const state = createTriviaGame('Mixed', 10)
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
        case 'truth-or-dare': {
          const state = createTruthDareGame(playerIds, 'safe')
          rm.setGameState(room.code, state)
          broadcast(room.code)
          broadcastGame(room.code)
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

          // Early reveal if all players answered
          const answered = Object.keys(state.answers).length
          if (answered >= room.players.length) {
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
        case 'td_pick': {
          if (room.gameState.game !== 'truth-or-dare') return
          const state = playerPicksTD(room.gameState, socket.id, action.choice)
          rm.setGameState(room.code, state)
          broadcastGame(room.code)
          broadcast(room.code)
          break
        }
        case 'td_done': {
          if (room.gameState.game !== 'truth-or-dare') return
          const state = completeTurn(room.gameState)
          rm.setGameState(room.code, state)
          broadcastGame(room.code)
          broadcast(room.code)
          break
        }
        case 'td_skip': {
          if (room.gameState.game !== 'truth-or-dare') return
          const state = skipTurn(room.gameState, socket.id)
          rm.setGameState(room.code, state)
          broadcastGame(room.code)
          broadcast(room.code)
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
    console.log('\n🎮  Yomu Game Night')
    console.log(`   Local:   http://localhost:${port}`)
    console.log(`   Network: http://${ip}:${port}`)
    console.log(`\n   TV → open  http://${ip}:${port}`)
    console.log(`   Players → scan QR or go to  http://${ip}:${port}/join\n`)
  })
})
