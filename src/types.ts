export interface CardLink {
  label: string
  url: string
}

export interface KanbanCard {
  id: string
  title: string
  description: string
  links: CardLink[]
}

export interface KanbanColumn {
  id: string
  title: string
  cardIds: string[]
}

export interface Board {
  id: string
  title: string
  sourceQuery: string
  createdAt: number
  columns: KanbanColumn[]
  cards: Record<string, KanbanCard>
}

export interface SearchResult {
  query: string
  answer: string
  related: string[]
  demo?: boolean
}

export type TabContent =
  | { kind: 'home' }
  | { kind: 'loading'; query: string; stage: string }
  | { kind: 'search'; result: SearchResult }
  | { kind: 'intent'; goal: string; query: string; boardId: string }
  | { kind: 'board'; boardId: string }
  | { kind: 'error'; message: string; query?: string }
  | { kind: 'notfound' }

export interface Tab {
  id: string
  title: string
  url: string
  content: TabContent
}

export interface ClassifyResponse {
  type: 'actionable_intent' | 'general_search'
  goal: string | null
  confidence: number
  answer: string | null
  related?: string[] | null
  demo?: boolean
}

export interface GenerateBoardResponse {
  boardTitle: string
  cards: { title: string; description: string; links: CardLink[] }[]
  demo?: boolean
}
