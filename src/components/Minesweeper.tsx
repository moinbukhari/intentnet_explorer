import { useEffect, useRef, useState } from 'react'

const ROWS = 9
const COLS = 9
const MINES = 10

interface Cell {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacent: number
}

type GameStatus = 'ready' | 'playing' | 'won' | 'lost'

function freshGrid(): Cell[] {
  return Array.from({ length: ROWS * COLS }, () => ({
    mine: false,
    revealed: false,
    flagged: false,
    adjacent: 0,
  }))
}

function neighbors(idx: number): number[] {
  const r = Math.floor(idx / COLS)
  const c = idx % COLS
  const out: number[] = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = r + dr
      const nc = c + dc
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push(nr * COLS + nc)
    }
  }
  return out
}

// First click is always safe: mines are placed after it, avoiding that cell.
function placeMines(grid: Cell[], safeIdx: number): Cell[] {
  const next = grid.map((c) => ({ ...c }))
  const candidates = next.map((_, i) => i).filter((i) => i !== safeIdx)
  for (let placed = 0; placed < MINES; placed++) {
    const pick = Math.floor(Math.random() * candidates.length)
    next[candidates[pick]].mine = true
    candidates.splice(pick, 1)
  }
  for (let i = 0; i < next.length; i++) {
    next[i].adjacent = neighbors(i).filter((n) => next[n].mine).length
  }
  return next
}

function floodReveal(grid: Cell[], start: number): Cell[] {
  const next = grid.map((c) => ({ ...c }))
  const stack = [start]
  while (stack.length) {
    const idx = stack.pop()!
    const cell = next[idx]
    if (cell.revealed || cell.flagged) continue
    cell.revealed = true
    if (cell.adjacent === 0 && !cell.mine) {
      for (const n of neighbors(idx)) {
        if (!next[n].revealed) stack.push(n)
      }
    }
  }
  return next
}

export function Minesweeper() {
  const [grid, setGrid] = useState<Cell[]>(freshGrid)
  const [status, setStatus] = useState<GameStatus>('ready')
  const [flagMode, setFlagMode] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (status === 'playing' && !timerRef.current) {
      timerRef.current = setInterval(() => setElapsed((t) => Math.min(t + 1, 999)), 1000)
    }
    if (status !== 'playing' && timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [status])

  const reset = () => {
    setGrid(freshGrid())
    setStatus('ready')
    setElapsed(0)
  }

  const checkWin = (g: Cell[]): boolean => g.every((c) => c.mine || c.revealed)

  const reveal = (idx: number) => {
    if (status === 'won' || status === 'lost') return
    let g = grid
    if (status === 'ready') {
      g = placeMines(g, idx)
      setStatus('playing')
    }
    const cell = g[idx]
    if (cell.flagged || cell.revealed) return
    if (cell.mine) {
      const exploded = g.map((c) => ({ ...c, revealed: c.mine ? true : c.revealed }))
      setGrid(exploded)
      setStatus('lost')
      return
    }
    const next = floodReveal(g, idx)
    setGrid(next)
    if (checkWin(next)) setStatus('won')
  }

  const toggleFlag = (idx: number) => {
    if (status === 'won' || status === 'lost') return
    const cell = grid[idx]
    if (cell.revealed) return
    setGrid(grid.map((c, i) => (i === idx ? { ...c, flagged: !c.flagged } : c)))
  }

  const handleCellClick = (idx: number) => {
    if (flagMode) toggleFlag(idx)
    else reveal(idx)
  }

  const flags = grid.filter((c) => c.flagged).length
  const face = status === 'lost' ? '😵' : status === 'won' ? '😎' : '🙂'
  const pad = (n: number) => String(Math.max(0, Math.min(999, n))).padStart(3, '0')

  return (
    <div className="minesweeper">
      <div className="ms-top">
        <span className="ms-led">{pad(MINES - flags)}</span>
        <button className="ms-face" onClick={reset} aria-label="New game">
          {face}
        </button>
        <span className="ms-led">{pad(elapsed)}</span>
      </div>
      <div
        className="ms-grid"
        onContextMenu={(e) => e.preventDefault()}
      >
        {grid.map((cell, idx) => {
          let content = ''
          if (cell.flagged && !cell.revealed) content = '🚩'
          else if (cell.revealed && cell.mine) content = '💣'
          else if (cell.revealed && cell.adjacent > 0) content = String(cell.adjacent)
          return (
            <button
              key={idx}
              className={`ms-cell${cell.revealed ? ' revealed' : ''}${
                cell.revealed && cell.adjacent > 0 ? ` num-${cell.adjacent}` : ''
              }${cell.revealed && cell.mine ? ' boom' : ''}`}
              onClick={() => handleCellClick(idx)}
              onContextMenu={(e) => {
                e.preventDefault()
                toggleFlag(idx)
              }}
              disabled={status === 'won' || status === 'lost'}
            >
              {content}
            </button>
          )
        })}
      </div>
      <div className="ms-controls">
        <button className={`ms-flag-toggle${flagMode ? ' active' : ''}`} onClick={() => setFlagMode((f) => !f)}>
          🚩 Flag mode {flagMode ? 'ON' : 'OFF'}
        </button>
        <span className="ms-status">
          {status === 'won' && 'You win! The page is still missing though.'}
          {status === 'lost' && 'BOOM. Press the face to try again.'}
          {(status === 'ready' || status === 'playing') && 'Right-click (or flag mode) to mark mines.'}
        </span>
      </div>
    </div>
  )
}
