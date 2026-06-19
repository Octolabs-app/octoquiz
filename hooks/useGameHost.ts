'use client'
/**
 * useGameHost — runs all OctoQuiz game logic on the host client.
 *
 * Uses a Cloudflare Durable Object room relay.
 * The host browser IS the game server: it manages state, runs timers,
 * and broadcasts updates to players through the room relay.
 */
import { useEffect, useRef, useCallback, useState } from 'react'
import { realtimeUrl, parseRelayMessage, sendRelay } from '@/lib/realtime'
import type { Room, RoomPublic, GameState, GameAction, TriviaConfig, GameType } from '@/lib/types'

// ── Game logic imports (pure functions owned by the host MVP) ──────────────────
import {
  createTriviaGame, startQuestion, submitTriviaAnswer,
  calculateTriviaPoints, updateStreaks, eliminateWrongAnswers,
  isSuddenDeathOver, advanceTriviaQuestion, revealTriviaAnswer,
  showTriviaLeaderboard,
} from '@/lib/games/trivia'
import {
  createFlagQuizGame, startFlagQuestion, submitFlagAnswer,
  calculateFlagPoints, advanceFlagQuestion, revealFlagAnswer,
  showFlagLeaderboard,
} from '@/lib/games/flag-quiz'
import {
  createImposterGame, startDiscussion, startVoting, submitVote,
  resolveVotes, nextImposterRound,
} from '@/lib/games/imposter'
import {
  createCapitalsGame, startCapitalsQuestion, submitCapitalsAnswer,
  calculateCapitalsPoints, advanceCapitalsQuestion, revealCapitalsAnswer,
  showCapitalsLeaderboard,
} from '@/lib/games/capitals'
import {
  createLandmarksGame, startLandmarksQuestion, submitLandmarksAnswer,
  calculateLandmarksPoints, advanceLandmarksQuestion, revealLandmarksAnswer,
  showLandmarksLeaderboard,
} from '@/lib/games/landmarks'
import {
  createDrawImposterGame, startDrawing, advanceTurn, openDrawVoting,
  addVoteCall, shouldStartEarlyVote, submitDrawVote, resolveDrawVotes,
} from '@/lib/games/draw-imposter'
import type { DrawStroke } from '@/lib/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function toPublic(room: Room): RoomPublic {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hostId, ...pub } = room
  return pub
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useGameHost(roomCode: string) {
  const [room, setRoom]           = useState<Room | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [connected, setConnected] = useState(false)
  // Strokes on the single shared Decoy whiteboard (all players draw on it in turn)
  const [drawStrokes, setDrawStrokes] = useState<DrawStroke[]>([])

  const channelRef = useRef<WebSocket | null>(null)
  const roomRef    = useRef<Room | null>(null)           // always-current ref
  const gameRef    = useRef<GameState | null>(null)
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep refs in sync
  useEffect(() => { roomRef.current = room }, [room])
  useEffect(() => { gameRef.current = gameState }, [gameState])

  // ── Timer helpers ───────────────────────────────────────────────────────────
  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }, [])

  const setTimer = useCallback((ms: number, fn: () => void) => {
    clearTimer()
    timerRef.current = setTimeout(fn, ms)
  }, [clearTimer])

  // ── Broadcast helpers ────────────────────────────────────────────────────────
  const broadcastRoom = useCallback((r: Room) => {
    sendRelay(channelRef.current, { type: 'broadcast', event: 'room_state', payload: toPublic(r) })
  }, [])

  const broadcastGame = useCallback((gs: GameState) => {
    sendRelay(channelRef.current, { type: 'broadcast', event: 'game_state', payload: gs })
  }, [])

  // Convenience: update room state + broadcast
  const updateRoom = useCallback((updater: (prev: Room) => Room) => {
    setRoom(prev => {
      if (!prev) return prev
      const next = updater(prev)
      roomRef.current = next
      broadcastRoom(next)
      return next
    })
  }, [broadcastRoom])

  const updateGame = useCallback((gs: GameState | null) => {
    setGameState(gs)
    gameRef.current = gs
    if (gs) broadcastGame(gs)
  }, [broadcastGame])

  // ── Game flow ─────────────────────────────────────────────────────────────
  // ─ Trivia ─
  const triviaStartQuestion = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'trivia') return
    const state = startQuestion(gs)
    updateGame(state)
    setTimer(state.timeLimit * 1000, triviaReveal)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGame, setTimer])

  const triviaReveal = useCallback(() => {
    clearTimer()
    const gs = gameRef.current; const r = roomRef.current
    if (!gs || gs.game !== 'trivia' || !r) return
    const playerIds = r.players.map(p => p.id)
    const pts = calculateTriviaPoints(gs, playerIds)
    // Add points to room players
    let updatedPlayers = r.players.map(p => ({ ...p, score: p.score + (pts[p.id] ?? 0) }))
    let state = updateStreaks(gs, playerIds)
    state = eliminateWrongAnswers(state, playerIds)
    state = revealTriviaAnswer(state)
    const nextRoom = { ...r, players: updatedPlayers }
    roomRef.current = nextRoom
    setRoom(nextRoom)
    broadcastRoom(nextRoom)
    updateGame(state)
    if (isSuddenDeathOver(state, playerIds)) {
      setTimer(3000, () => {
        const finished = { ...state, phase: 'finished' as const }
        updateGame(finished)
        setTimer(1500, () => updateRoom(rr => ({ ...rr, status: 'results' })))
      })
      return
    }
    setTimer(3500, triviaLeaderboard)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearTimer, updateGame, broadcastRoom, setTimer, updateRoom])

  const triviaLeaderboard = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'trivia') return
    updateGame(showTriviaLeaderboard(gs))
    setTimer(4000, triviaNextQuestion)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGame, setTimer])

  const triviaNextQuestion = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'trivia') return
    const next = advanceTriviaQuestion(gs)
    updateGame(next)
    if (next.phase === 'finished') {
      updateRoom(r => ({ ...r, status: 'results' })); return
    }
    setTimer(2000, triviaStartQuestion)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGame, updateRoom, setTimer, triviaStartQuestion])

  // ─ Flag Quiz ─
  const flagStartQuestion = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'flag-quiz') return
    const state = startFlagQuestion(gs)
    updateGame(state)
    setTimer(state.timeLimit * 1000, flagReveal)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGame, setTimer])

  const flagReveal = useCallback(() => {
    clearTimer()
    const gs = gameRef.current; const r = roomRef.current
    if (!gs || gs.game !== 'flag-quiz' || !r) return
    const pts = calculateFlagPoints(gs, r.players.map(p => p.id))
    const updatedPlayers = r.players.map(p => ({ ...p, score: p.score + (pts[p.id] ?? 0) }))
    const nextRoom = { ...r, players: updatedPlayers }
    roomRef.current = nextRoom; setRoom(nextRoom); broadcastRoom(nextRoom)
    updateGame(revealFlagAnswer(gs))
    setTimer(3500, flagLeaderboard)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearTimer, updateGame, broadcastRoom, setTimer])

  const flagLeaderboard = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'flag-quiz') return
    updateGame(showFlagLeaderboard(gs)); setTimer(4000, flagNextQuestion)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGame, setTimer])

  const flagNextQuestion = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'flag-quiz') return
    const next = advanceFlagQuestion(gs); updateGame(next)
    if (next.phase === 'finished') { updateRoom(r => ({ ...r, status: 'results' })); return }
    setTimer(2000, flagStartQuestion)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGame, updateRoom, setTimer, flagStartQuestion])

  // ─ Capitals ─
  const capitalsStartQuestion = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'capitals') return
    const state = startCapitalsQuestion(gs); updateGame(state)
    setTimer(state.timeLimit * 1000, capitalsReveal)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGame, setTimer])

  const capitalsReveal = useCallback(() => {
    clearTimer()
    const gs = gameRef.current; const r = roomRef.current
    if (!gs || gs.game !== 'capitals' || !r) return
    const pts = calculateCapitalsPoints(gs, r.players.map(p => p.id))
    const updatedPlayers = r.players.map(p => ({ ...p, score: p.score + (pts[p.id] ?? 0) }))
    const nextRoom = { ...r, players: updatedPlayers }
    roomRef.current = nextRoom; setRoom(nextRoom); broadcastRoom(nextRoom)
    updateGame(revealCapitalsAnswer(gs)); setTimer(3500, capitalsLeaderboard)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearTimer, updateGame, broadcastRoom, setTimer])

  const capitalsLeaderboard = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'capitals') return
    updateGame(showCapitalsLeaderboard(gs)); setTimer(4000, capitalsNext)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGame, setTimer])

  const capitalsNext = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'capitals') return
    const next = advanceCapitalsQuestion(gs); updateGame(next)
    if (next.phase === 'finished') { updateRoom(r => ({ ...r, status: 'results' })); return }
    setTimer(2000, capitalsStartQuestion)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGame, updateRoom, setTimer, capitalsStartQuestion])

  // ─ Landmarks ─
  const landmarksStartQuestion = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'landmarks') return
    const state = startLandmarksQuestion(gs); updateGame(state)
    setTimer(state.timeLimit * 1000, landmarksReveal)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGame, setTimer])

  const landmarksReveal = useCallback(() => {
    clearTimer()
    const gs = gameRef.current; const r = roomRef.current
    if (!gs || gs.game !== 'landmarks' || !r) return
    const pts = calculateLandmarksPoints(gs, r.players.map(p => p.id))
    const updatedPlayers = r.players.map(p => ({ ...p, score: p.score + (pts[p.id] ?? 0) }))
    const nextRoom = { ...r, players: updatedPlayers }
    roomRef.current = nextRoom; setRoom(nextRoom); broadcastRoom(nextRoom)
    updateGame(revealLandmarksAnswer(gs)); setTimer(3500, landmarksLeaderboard)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearTimer, updateGame, broadcastRoom, setTimer])

  const landmarksLeaderboard = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'landmarks') return
    updateGame(showLandmarksLeaderboard(gs)); setTimer(4000, landmarksNext)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGame, setTimer])

  const landmarksNext = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'landmarks') return
    const next = advanceLandmarksQuestion(gs); updateGame(next)
    if (next.phase === 'finished') { updateRoom(r => ({ ...r, status: 'results' })); return }
    setTimer(2000, landmarksStartQuestion)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGame, updateRoom, setTimer, landmarksStartQuestion])

  // ─ Imposter ─
  const imposterStartDiscussion = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'imposter') return
    const state = startDiscussion(gs); updateGame(state)
    setTimer(state.discussionSeconds * 1000, imposterOpenVoting)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGame, setTimer])

  const imposterOpenVoting = useCallback(() => {
    clearTimer()
    const gs = gameRef.current
    if (!gs || gs.game !== 'imposter') return
    const state = startVoting(gs); updateGame(state)
    setTimer(30_000, imposterResolve)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearTimer, updateGame, setTimer])

  const imposterResolve = useCallback(() => {
    clearTimer()
    const gs = gameRef.current; const r = roomRef.current
    if (!gs || gs.game !== 'imposter' || !r) return
    const { state, points } = resolveVotes(gs, r.players.map(p => ({ id: p.id, name: p.name })))
    const updatedPlayers = r.players.map(p => ({ ...p, score: p.score + (points[p.id] ?? 0) }))
    const nextRoom = { ...r, players: updatedPlayers }
    roomRef.current = nextRoom; setRoom(nextRoom); broadcastRoom(nextRoom)
    updateGame(state)
    if (state.phase === 'finished') {
      setTimer(5000, () => updateRoom(rr => ({ ...rr, status: 'results' })))
    } else {
      setTimer(6000, () => {
        const r2 = roomRef.current; const gs2 = gameRef.current
        if (!r2 || !gs2 || gs2.game !== 'imposter') return
        const nextState = nextImposterRound(gs2, r2.players.map(p => p.id))
        updateGame(nextState)
        setTimer(5000, imposterStartDiscussion)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearTimer, updateGame, broadcastRoom, setTimer, updateRoom, imposterStartDiscussion])

  // ─ Decoy (drawing imposter) ─
  const drawResolve = useCallback(() => {
    clearTimer()
    const gs = gameRef.current; const r = roomRef.current
    if (!gs || gs.game !== 'drawimposter' || !r) return
    const { state, points } = resolveDrawVotes(gs, r.players.map(p => ({ id: p.id, name: p.name })))
    const updatedPlayers = r.players.map(p => ({ ...p, score: p.score + (points[p.id] ?? 0) }))
    const nextRoom = { ...r, players: updatedPlayers }
    roomRef.current = nextRoom; setRoom(nextRoom); broadcastRoom(nextRoom)
    updateGame(state)
    setTimer(8000, () => updateRoom(rr => ({ ...rr, status: 'results' })))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearTimer, updateGame, broadcastRoom, setTimer, updateRoom])

  const drawOpenVoting = useCallback(() => {
    clearTimer()
    const gs = gameRef.current
    if (!gs || gs.game !== 'drawimposter') return
    updateGame(openDrawVoting(gs))
    setTimer(45_000, drawResolve)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearTimer, updateGame, setTimer, drawResolve])

  const drawNextTurn = useCallback(() => {
    clearTimer()
    const gs = gameRef.current
    if (!gs || gs.game !== 'drawimposter') return
    const { state, done } = advanceTurn(gs)
    if (done) { drawOpenVoting(); return }
    updateGame(state)
    setTimer(state.turnSeconds * 1000, drawNextTurn)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearTimer, updateGame, setTimer, drawOpenVoting])

  const drawStartDrawing = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'drawimposter') return
    const state = startDrawing(gs)
    updateGame(state)
    setTimer(state.turnSeconds * 1000, drawNextTurn)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGame, setTimer, drawNextTurn])

  // Host TV "Start vote now" button + early-vote majority both land here
  const drawSkipToVote = useCallback(() => {
    const gs = gameRef.current
    if (!gs || gs.game !== 'drawimposter' || gs.phase === 'voting' || gs.phase === 'finished') return
    drawOpenVoting()
  }, [drawOpenVoting])

  // ── Handle player actions ─────────────────────────────────────────────────
  const handleAction = useCallback((playerId: string, action: GameAction) => {
    const gs = gameRef.current; const r = roomRef.current
    if (!gs || !r) return

    if (action.type === 'trivia_answer' && gs.game === 'trivia') {
      const updated = submitTriviaAnswer(gs, playerId, action.answerId)
      updateGame(updated)
      // Auto-reveal when all non-eliminated players answered
      const activeIds = r.players.filter(p => !gs.eliminated.includes(p.id)).map(p => p.id)
      const allAnswered = activeIds.every(id => updated.answers[id])
      if (allAnswered) triviaReveal()
    } else if (action.type === 'flag_answer' && gs.game === 'flag-quiz') {
      updateGame(submitFlagAnswer(gs, playerId, action.answer))
      const allAnswered = r.players.every(p => gameRef.current?.game === 'flag-quiz' && (gameRef.current as typeof gs).answers[p.id])
      if (allAnswered) flagReveal()
    } else if (action.type === 'imposter_vote' && gs.game === 'imposter') {
      const updated = submitVote(gs, playerId, action.targetId)
      updateGame(updated)
      const allVoted = r.players.every(p => updated.votes[p.id])
      if (allVoted) imposterResolve()
    } else if (action.type === 'capitals_answer' && gs.game === 'capitals') {
      updateGame(submitCapitalsAnswer(gs, playerId, action.answer))
      const allAnswered = r.players.every(p => (gameRef.current as typeof gs)?.answers[p.id])
      if (allAnswered) capitalsReveal()
    } else if (action.type === 'landmarks_answer' && gs.game === 'landmarks') {
      updateGame(submitLandmarksAnswer(gs, playerId, action.answer))
      const allAnswered = r.players.every(p => (gameRef.current as typeof gs)?.answers[p.id])
      if (allAnswered) landmarksReveal()
    } else if (action.type === 'stroke_done' && gs.game === 'drawimposter') {
      // One-stroke-per-turn: as soon as the current drawer finishes their line,
      // pass to the next player (short delay so everyone sees the line land).
      if (gs.phase === 'drawing' && playerId === gs.currentDrawer) {
        setTimer(700, drawNextTurn)
      }
    } else if (action.type === 'call_vote' && gs.game === 'drawimposter') {
      if (gs.phase !== 'drawing') return
      const updated = addVoteCall(gs, playerId)
      updateGame(updated)
      if (shouldStartEarlyVote(updated, r.players.length)) drawSkipToVote()
    } else if (action.type === 'drawimposter_vote' && gs.game === 'drawimposter') {
      const updated = submitDrawVote(gs, playerId, action.targetId)
      updateGame(updated)
      const allVoted = r.players.every(p => updated.votes[p.id])
      if (allVoted) drawResolve()
    }
  }, [updateGame, triviaReveal, flagReveal, imposterResolve, capitalsReveal, landmarksReveal, drawResolve, drawSkipToVote, drawNextTurn, setTimer])

  // ── Host actions ──────────────────────────────────────────────────────────
  const selectGame = useCallback((game: GameType) => {
    updateRoom(r => ({ ...r, status: 'game-select', currentGame: game, gameState: null }))
    setGameState(null)
  }, [updateRoom])

  const startGame = useCallback(async (config?: TriviaConfig) => {
    const r = roomRef.current
    if (!r) return
    let gs: GameState
    const game = r.currentGame ?? 'trivia'
    if (game === 'trivia') gs = await createTriviaGame(config!)
    else if (game === 'flag-quiz') gs = await createFlagQuizGame()
    else if (game === 'imposter') gs = createImposterGame(r.players.map(p => p.id), 3)
    else if (game === 'capitals') gs = await createCapitalsGame()
    else if (game === 'landmarks') gs = await createLandmarksGame()
    else if (game === 'drawimposter') {
      setDrawStrokes([])
      sendRelay(channelRef.current, { type: 'broadcast', event: 'draw_reset', payload: {} })
      gs = createDrawImposterGame(r.players.map(p => p.id), 4)
    }
    else return

    updateRoom(rr => ({ ...rr, status: 'playing', gameState: gs }))
    updateGame(gs)

    // Kick off game flow
    if (game === 'trivia') setTimer(2500, triviaStartQuestion)
    else if (game === 'flag-quiz') setTimer(2500, flagStartQuestion)
    else if (game === 'imposter') setTimer(5000, imposterStartDiscussion)
    else if (game === 'capitals') setTimer(2500, capitalsStartQuestion)
    else if (game === 'landmarks') setTimer(2500, landmarksStartQuestion)
    else if (game === 'drawimposter') setTimer(6000, drawStartDrawing)
  }, [updateRoom, updateGame, setTimer, triviaStartQuestion, flagStartQuestion,
      imposterStartDiscussion, capitalsStartQuestion, landmarksStartQuestion, drawStartDrawing])

  const kickPlayer = useCallback((playerId: string) => {
    sendRelay(channelRef.current, { type: 'broadcast', event: 'player_kicked', payload: { id: playerId } })
    updateRoom(r => ({ ...r, players: r.players.filter(p => p.id !== playerId) }))
  }, [updateRoom])

  const endGame = useCallback(() => {
    clearTimer()
    updateRoom(r => ({ ...r, status: 'results' }))
  }, [clearTimer, updateRoom])

  const nextRound = useCallback(() => {
    clearTimer()
    setDrawStrokes([])
    updateRoom(r => ({ ...r, status: 'lobby', currentGame: null, gameState: null }))
    updateGame(null)
  }, [clearTimer, updateRoom, updateGame])

  // ── Cloudflare room relay setup ───────────────────────────────────────────
  useEffect(() => {
    const code = roomCode.toUpperCase()
    const hostId = `host-${code}`

    // Create initial room state
    const initialRoom: Room = {
      code,
      hostId,
      gameMasterId: null,
      players: [],
      status: 'lobby',
      currentGame: null,
      gameState: null,
      createdAt: Date.now(),
    }
    setRoom(initialRoom)
    roomRef.current = initialRoom

    const socket = new WebSocket(realtimeUrl(code))
    channelRef.current = socket

    socket.addEventListener('open', () => {
      setConnected(true)
      sendRelay(socket, { type: 'presence_track', payload: { role: 'host', hostId } })
      // Send initial room state to any players who joined before host.
      sendRelay(socket, { type: 'broadcast', event: 'room_state', payload: toPublic(initialRoom) })
    })

    socket.addEventListener('message', event => {
      const msg = parseRelayMessage(event.data)
      if (!msg) return

      if (msg.type === 'presence' && msg.event === 'join') {
        msg.newPresences.forEach((p: Record<string, unknown>) => {
          if (p['role'] !== 'player') return
          const player = {
            id:          p['id'] as string,
            name:        p['name'] as string,
            avatar:      p['avatar'] as string,
            color:       p['color'] as string,
            score:       0,
            isReady:     false,
            isConnected: true,
          }
          setRoom(prev => {
            if (!prev) return prev
            if (prev.players.find(pl => pl.id === player.id)) {
              const next = {
                ...prev,
                players: prev.players.map(pl => pl.id === player.id ? { ...pl, ...player, isReady: pl.isReady } : pl),
              }
              roomRef.current = next
              broadcastRoom(next)
              return next
            }
            if (prev.status !== 'lobby') return prev
            if (prev.players.length >= 50) return prev
            const next = {
              ...prev,
              players: [...prev.players, player],
              gameMasterId: prev.gameMasterId ?? player.id,
            }
            roomRef.current = next
            broadcastRoom(next)
            return next
          })
        })
        return
      }

      if (msg.type === 'presence' && msg.event === 'leave') {
        setRoom(prev => {
          if (!prev) return prev
          const next = { ...prev, players: prev.players.map(p => p.id === msg.key ? { ...p, isConnected: false } : p) }
          roomRef.current = next
          broadcastRoom(next)
          return next
        })
        return
      }

      if (msg.type !== 'broadcast' || !msg.payload || typeof msg.payload !== 'object') return

      if (msg.event === 'player_action') {
        const payload = msg.payload as { playerId?: string; action?: GameAction }
        if (payload.playerId && payload.action) handleAction(payload.playerId, payload.action)
      } else if (msg.event === 'player_ready') {
        const payload = msg.payload as { playerId?: string }
        if (!payload.playerId) return
        updateRoom(r => ({
          ...r,
          players: r.players.map(p => p.id === payload.playerId ? { ...p, isReady: true } : p),
        }))
      } else if (msg.event === 'draw') {
        const payload = msg.payload as { stroke?: DrawStroke }
        if (payload.stroke) setDrawStrokes(prev => [...prev, payload.stroke!]) // shared whiteboard
      } else if (msg.event === 'draw_reset') {
        setDrawStrokes([])
      }
    })

    socket.addEventListener('close', () => setConnected(false))
    socket.addEventListener('error', () => setConnected(false))

    return () => {
      clearTimer()
      socket.close()
      channelRef.current = null
    }
  }, [roomCode, broadcastRoom, handleAction, updateRoom, clearTimer])

  return {
    room:      room ? toPublic(room) : null,
    gameState,
    connected,
    selectGame,
    startGame,
    kickPlayer,
    endGame,
    nextRound,
    drawStrokes,
    drawSkipToVote,
  }
}
