import { useState } from 'react'
import type { Board } from '../types'

interface HomePageProps {
  boards: Board[]
  onSearch: (query: string) => void
  onOpenBoard: (boardId: string) => void
  onDeleteBoard: (boardId: string) => void
}

const EXAMPLES = [
  'how do I start a business',
  'what is the capital of Turkey',
  'I want to run a marathon',
  'who invented the telephone',
]

function boardProgress(board: Board): { done: number; total: number } {
  const done = board.columns.find((c) => c.id === 'done')?.cardIds.length ?? 0
  return { done, total: Object.keys(board.cards).length }
}

export function HomePage({ boards, onSearch, onOpenBoard, onDeleteBoard }: HomePageProps) {
  const [query, setQuery] = useState('')

  return (
    <div className="home-page">
      <div className="marquee-banner">
        <span className="marquee-text">
          ★ Welcome to IntentNet Explorer — the browser that turns your intentions into action! ★ Type a goal, get a
          plan. ★ Best viewed at 800x600 ★
        </span>
      </div>

      <div className="home-logo">
        <span className="home-logo-e">e</span>
        <h1>
          Intent<b>Net</b> Explorer
        </h1>
        <p className="home-tagline">Where do you want to <i>go</i> today... and what do you want to <b>do</b>?</p>
      </div>

      <form
        className="home-search"
        onSubmit={(e) => {
          e.preventDefault()
          onSearch(query)
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web, or type a goal..."
          autoFocus
        />
        <button type="submit">Search</button>
      </form>

      <div className="home-examples">
        <span>Try:</span>
        {EXAMPLES.map((ex) => (
          <button key={ex} className="example-chip" onClick={() => onSearch(ex)}>
            {ex}
          </button>
        ))}
      </div>

      <fieldset className="home-boards">
        <legend>📋 Your Boards</legend>
        {boards.length === 0 ? (
          <p className="home-boards-empty">
            No boards yet. Search for something actionable — like <i>"how do I start a business"</i> — and the
            IntentNet Agent will build you a plan.
          </p>
        ) : (
          <table className="boards-table">
            <thead>
              <tr>
                <th>Board</th>
                <th>Progress</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {boards.map((b) => {
                const { done, total } = boardProgress(b)
                return (
                  <tr key={b.id}>
                    <td>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          onOpenBoard(b.id)
                        }}
                      >
                        {b.title}
                      </a>
                    </td>
                    <td>
                      {done}/{total} done
                    </td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="board-delete" onClick={() => onDeleteBoard(b.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </fieldset>

      <p className="home-footer">
        🚧 This page is under construction 🚧 · © 2001 IntentNet Corporation · Optimised for Internet Explorer 6.0
      </p>
    </div>
  )
}
