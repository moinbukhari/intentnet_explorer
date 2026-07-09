import { useState } from 'react'
import type { Board, KanbanCard } from '../types'

interface KanbanBoardProps {
  board: Board
  onMoveCard: (boardId: string, cardId: string, toColumnId: string) => void
}

const COLUMN_ICONS: Record<string, string> = {
  todo: '📌',
  doing: '⚙️',
  done: '✅',
}

function Card({
  card,
  done,
  onDragStart,
}: {
  card: KanbanCard
  done: boolean
  onDragStart: (e: React.DragEvent, cardId: string) => void
}) {
  return (
    <div
      className={`kanban-card${done ? ' done' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
    >
      <div className="kanban-card-title">{card.title}</div>
      {card.description && <div className="kanban-card-desc">{card.description}</div>}
      {card.links.length > 0 && (
        <div className="kanban-card-links">
          {card.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
              🔗 {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export function KanbanBoard({ board, onMoveCard }: KanbanBoardProps) {
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const total = Object.keys(board.cards).length
  const done = board.columns.find((c) => c.id === 'done')?.cardIds.length ?? 0

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(null)
    const cardId = e.dataTransfer.getData('text/plain')
    if (cardId && board.cards[cardId]) {
      onMoveCard(board.id, cardId, columnId)
    }
  }

  return (
    <div className="kanban-page">
      <div className="kanban-header">
        <h2>📋 {board.title}</h2>
        <div className="kanban-meta">
          <span>
            Generated from: <i>"{board.sourceQuery}"</i>
          </span>
          <span className="kanban-progress-text">
            {done} of {total} steps done
          </span>
          <span className="kanban-progress-track">
            <span className="kanban-progress-fill" style={{ width: total ? `${(done / total) * 100}%` : '0%' }} />
          </span>
        </div>
      </div>
      <p className="kanban-hint">Drag cards between columns to track your progress. Your board is saved automatically.</p>
      <div className="kanban-columns">
        {board.columns.map((col) => (
          <div
            key={col.id}
            className={`kanban-column${dragOverColumn === col.id ? ' drag-over' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              e.dataTransfer.dropEffect = 'move'
              setDragOverColumn(col.id)
            }}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="kanban-column-header">
              {COLUMN_ICONS[col.id] ?? '📄'} {col.title} <span className="kanban-count">({col.cardIds.length})</span>
            </div>
            <div className="kanban-column-body">
              {col.cardIds.map((cardId) => {
                const card = board.cards[cardId]
                if (!card) return null
                return (
                  <Card key={cardId} card={card} done={col.id === 'done'} onDragStart={handleDragStart} />
                )
              })}
              {col.cardIds.length === 0 && <div className="kanban-empty">Drop cards here</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
