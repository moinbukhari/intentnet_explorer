import { useState } from 'react'
import type { Board } from '../types'

interface HomePageProps {
  boards: Board[]
  onSearch: (query: string) => void
  onOpenBoard: (boardId: string) => void
  onDeleteBoard: (boardId: string) => void
  onOpen404: () => void
}

interface DirectoryLink {
  label: string
  query?: string
  open404?: boolean
}

interface DirectoryCategory {
  icon: string
  name: string
  links: DirectoryLink[]
}

const DIRECTORY: DirectoryCategory[] = [
  {
    icon: '💼',
    name: 'Business & Economy',
    links: [
      { label: 'Start a Business', query: 'how do I start a business' },
      { label: 'Side Hustles', query: 'I want to start a side hustle' },
      { label: 'Taxes', query: 'what is corporation tax' },
    ],
  },
  {
    icon: '💻',
    name: 'Computers & Internet',
    links: [
      { label: 'Build a Website', query: 'how do I build a website' },
      { label: 'The WWW', query: 'what is the world wide web' },
      { label: 'Y2K', query: 'what was the y2k bug' },
    ],
  },
  {
    icon: '🏃',
    name: 'Health & Fitness',
    links: [
      { label: 'Run a Marathon', query: 'I want to run a marathon' },
      { label: 'Nutrition', query: 'is coffee healthy' },
      { label: 'Sleep', query: 'how do I fix my sleep schedule' },
    ],
  },
  {
    icon: '📚',
    name: 'Education',
    links: [
      { label: 'Learn Guitar', query: 'I want to learn guitar' },
      { label: 'Languages', query: 'I want to learn Spanish' },
      { label: 'History', query: 'who invented the telephone' },
    ],
  },
  {
    icon: '✈️',
    name: 'Travel',
    links: [
      { label: 'Move Abroad', query: 'I want to move to Spain' },
      { label: 'Trip to Japan', query: 'plan a trip to Japan' },
      { label: 'Capitals', query: 'what is the capital of Turkey' },
    ],
  },
  {
    icon: '🎮',
    name: 'Entertainment',
    links: [
      { label: 'Chess', query: 'how do I get better at chess' },
      { label: 'Movies', query: 'what was the first movie ever made' },
      { label: 'Games', open404: true },
    ],
  },
]

function boardProgress(board: Board): { done: number; total: number } {
  const done = board.columns.find((c) => c.id === 'done')?.cardIds.length ?? 0
  return { done, total: Object.keys(board.cards).length }
}

export function HomePage({ boards, onSearch, onOpenBoard, onDeleteBoard, onOpen404 }: HomePageProps) {
  const [query, setQuery] = useState('')

  const followLink = (link: DirectoryLink) => {
    if (link.open404) onOpen404()
    else if (link.query) onSearch(link.query)
  }

  return (
    <div className="home-page">
      <div className="marquee-banner">
        <span className="marquee-text">
          ★ Welcome to IntentNet! — the web directory that turns your intentions into action! ★ Type a goal, get a
          plan. ★ Best viewed at 800x600 ★
        </span>
      </div>

      <div className="yahoo-top-links">
        <span>What's New</span> · <span>Check Email</span> · <span>Personalize</span> · <span>Help</span>
      </div>

      <div className="home-logo">
        <h1 className="yahoo-logo">
          IntentNet<span className="yahoo-bang">!</span>
        </h1>
        <p className="home-tagline">The Web Directory of <b>Intent</b> — do more, browse less.</p>
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
      <div className="yahoo-search-links">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onSearch('how do I start a business')
          }}
        >
          advanced search
        </a>{' '}
        ·{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onOpen404()
          }}
        >
          I'm feeling lost
        </a>
      </div>

      <button className="yahoo-banner" onClick={onOpen404}>
        🎉 CONGRATULATIONS! You are the 1,000,000th visitor! CLICK HERE to claim your prize! 🎉
      </button>

      <div className="yahoo-directory">
        {DIRECTORY.map((cat) => (
          <div key={cat.name} className="yahoo-category">
            <div className="yahoo-category-name">
              {cat.icon} <b>{cat.name}</b>
            </div>
            <div className="yahoo-sublinks">
              {cat.links.map((link, i) => (
                <span key={link.label}>
                  {i > 0 && ', '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      followLink(link)
                    }}
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </div>
          </div>
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
        🚧 This page is under construction 🚧 · Company Info · Privacy Policy ·{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onOpen404()
          }}
        >
          404 Lounge
        </a>{' '}
        · © 2001 IntentNet! Inc. · Optimised for Internet Explorer 6.0
      </p>
    </div>
  )
}
