import { useCallback, useEffect, useState } from 'react'
import { classify, generateBoard } from './api'
import type { Board, GenerateBoardResponse, Tab, TabContent } from './types'
import { loadState, newHomeTab, saveState, type PersistedState } from './storage'
import { TitleBar } from './components/TitleBar'
import { MenuBar } from './components/MenuBar'
import { Toolbar } from './components/Toolbar'
import { AddressBar } from './components/AddressBar'
import { TabStrip } from './components/TabStrip'
import { StatusBar } from './components/StatusBar'
import { HomePage } from './pages/HomePage'
import { SearchResults } from './pages/SearchResults'
import { IntentDetected } from './pages/IntentDetected'
import { KanbanBoard } from './pages/KanbanBoard'
import { LoadingPage } from './pages/LoadingPage'
import { ErrorPage } from './pages/ErrorPage'
import { NotFoundPage } from './pages/NotFoundPage'

// Hold results back so the dial-up loader gets its moment (and its 90% stall).
async function withMinDuration<T>(promise: Promise<T>, ms: number): Promise<T> {
  const [result] = await Promise.all([promise, new Promise((resolve) => setTimeout(resolve, ms))])
  return result
}

const NOT_FOUND_TAB: Pick<Tab, 'title' | 'url' | 'content'> = {
  title: '404 Not Found',
  url: 'intentnet://404',
  content: { kind: 'notfound' },
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'board'
}

function buildBoard(res: GenerateBoardResponse, sourceQuery: string): Board {
  const cards: Board['cards'] = {}
  const cardIds: string[] = []
  for (const c of res.cards) {
    const id = crypto.randomUUID()
    cards[id] = { id, title: c.title, description: c.description, links: c.links ?? [] }
    cardIds.push(id)
  }
  return {
    id: crypto.randomUUID(),
    title: res.boardTitle,
    sourceQuery,
    createdAt: Date.now(),
    columns: [
      { id: 'todo', title: 'To Do', cardIds },
      { id: 'doing', title: 'In Progress', cardIds: [] },
      { id: 'done', title: 'Done', cardIds: [] },
    ],
    cards,
  }
}

export default function App() {
  const [state, setState] = useState<PersistedState>(loadState)
  const [status, setStatus] = useState('Done')
  const [busy, setBusy] = useState(false)

  useEffect(() => saveState(state), [state])

  const { tabs, activeTabId, boards } = state
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0]

  const updateTab = useCallback((tabId: string, patch: Partial<Tab>) => {
    setState((s) => ({
      ...s,
      tabs: s.tabs.map((t) => (t.id === tabId ? { ...t, ...patch } : t)),
    }))
  }, [])

  // Demo route: visiting /404 directly opens the not-found page (with Minesweeper).
  useEffect(() => {
    if (window.location.pathname.replace(/\/+$/, '') === '/404') {
      window.history.replaceState(null, '', '/')
      setState((s) => ({
        ...s,
        tabs: s.tabs.map((t) => (t.id === s.activeTabId ? { ...t, ...NOT_FOUND_TAB } : t)),
      }))
    }
  }, [])

  const navigate = useCallback(
    async (tabId: string, rawQuery: string) => {
      const query = rawQuery.trim()
      if (!query || busy) return
      if (/^(intentnet:\/\/)?\/?404\/?$/i.test(query)) {
        updateTab(tabId, { ...NOT_FOUND_TAB })
        setStatus('Done')
        return
      }
      setBusy(true)
      setStatus(`Opening page http://go.intentnet/?q=${encodeURIComponent(query)} ...`)
      updateTab(tabId, {
        title: 'Connecting...',
        url: `http://go.intentnet/?q=${encodeURIComponent(query)}`,
        content: { kind: 'loading', query, stage: 'Contacting the IntentNet Agent...' },
      })
      try {
        const result = await withMinDuration(classify(query), 5500)
        if (result.type === 'general_search') {
          updateTab(tabId, {
            title: query,
            content: {
              kind: 'search',
              result: { query, answer: result.answer ?? '', related: result.related ?? [], demo: result.demo },
            },
          })
          setStatus('Done')
        } else {
          const goal = result.goal || query
          updateTab(tabId, {
            content: { kind: 'loading', query, stage: `Actionable intent detected: "${goal}". Generating your plan...` },
          })
          setStatus('IntentNet Agent is generating your plan...')
          const boardRes = await withMinDuration(generateBoard(goal), 3000)
          const board = buildBoard(boardRes, query)
          const boardTab: Tab = {
            id: crypto.randomUUID(),
            title: board.title,
            url: `intentnet://board/${slugify(board.title)}`,
            content: { kind: 'board', boardId: board.id },
          }
          setState((s) => ({
            boards: { ...s.boards, [board.id]: board },
            tabs: [
              ...s.tabs.map((t) =>
                t.id === tabId
                  ? { ...t, title: query, content: { kind: 'intent', goal, query, boardId: board.id } as TabContent }
                  : t,
              ),
              boardTab,
            ],
            activeTabId: boardTab.id,
          }))
          setStatus('Done')
        }
      } catch (err) {
        updateTab(tabId, {
          title: 'The page cannot be displayed',
          content: { kind: 'error', message: err instanceof Error ? err.message : 'Unknown error', query },
        })
        setStatus('Done')
      } finally {
        setBusy(false)
      }
    },
    [busy, updateTab],
  )

  const searchFromActiveTab = useCallback(
    (query: string) => navigate(activeTab.id, query),
    [navigate, activeTab.id],
  )

  const activateTab = useCallback((tabId: string) => {
    setState((s) => ({ ...s, activeTabId: tabId }))
  }, [])

  const closeTab = useCallback((tabId: string) => {
    setState((s) => {
      const idx = s.tabs.findIndex((t) => t.id === tabId)
      let tabs = s.tabs.filter((t) => t.id !== tabId)
      if (tabs.length === 0) tabs = [newHomeTab()]
      const activeTabId =
        s.activeTabId === tabId ? tabs[Math.max(0, Math.min(idx, tabs.length - 1))].id : s.activeTabId
      return { ...s, tabs, activeTabId }
    })
  }, [])

  const openNewTab = useCallback(() => {
    const tab = newHomeTab()
    setState((s) => ({ ...s, tabs: [...s.tabs, tab], activeTabId: tab.id }))
  }, [])

  const goHome = useCallback(() => {
    updateTab(activeTab.id, { title: 'IntentNet Start', url: 'intentnet://home', content: { kind: 'home' } })
  }, [activeTab.id, updateTab])

  const refresh = useCallback(() => {
    const c = activeTab.content
    if (c.kind === 'search' || c.kind === 'intent' || c.kind === 'error' || c.kind === 'loading') {
      const query = c.kind === 'search' ? c.result.query : c.query
      if (query) navigate(activeTab.id, query)
    }
  }, [activeTab, navigate])

  const openBoard = useCallback((boardId: string) => {
    setState((s) => {
      const existing = s.tabs.find((t) => t.content.kind === 'board' && t.content.boardId === boardId)
      if (existing) return { ...s, activeTabId: existing.id }
      const board = s.boards[boardId]
      if (!board) return s
      const tab: Tab = {
        id: crypto.randomUUID(),
        title: board.title,
        url: `intentnet://board/${slugify(board.title)}`,
        content: { kind: 'board', boardId },
      }
      return { ...s, tabs: [...s.tabs, tab], activeTabId: tab.id }
    })
  }, [])

  const deleteBoard = useCallback((boardId: string) => {
    setState((s) => {
      const boards = { ...s.boards }
      delete boards[boardId]
      let tabs = s.tabs.map((t) =>
        t.content.kind === 'board' && t.content.boardId === boardId
          ? { ...newHomeTab(), id: t.id }
          : t,
      )
      return { ...s, boards, tabs }
    })
  }, [])

  const moveCard = useCallback((boardId: string, cardId: string, toColumnId: string) => {
    setState((s) => {
      const board = s.boards[boardId]
      if (!board) return s
      const columns = board.columns.map((col) => {
        const cardIds = col.cardIds.filter((id) => id !== cardId)
        if (col.id === toColumnId) cardIds.push(cardId)
        return { ...col, cardIds }
      })
      return { ...s, boards: { ...s.boards, [boardId]: { ...board, columns } } }
    })
  }, [])

  function renderContent(tab: Tab) {
    const c = tab.content
    switch (c.kind) {
      case 'home':
        return (
          <HomePage
            boards={Object.values(boards).sort((a, b) => b.createdAt - a.createdAt)}
            onSearch={searchFromActiveTab}
            onOpenBoard={openBoard}
            onDeleteBoard={deleteBoard}
            onOpen404={() => updateTab(tab.id, { ...NOT_FOUND_TAB })}
          />
        )
      case 'loading':
        return <LoadingPage query={c.query} stage={c.stage} />
      case 'search':
        return <SearchResults result={c.result} onSearch={searchFromActiveTab} />
      case 'intent':
        return <IntentDetected goal={c.goal} query={c.query} onOpenBoard={() => openBoard(c.boardId)} />
      case 'board': {
        const board = boards[c.boardId]
        if (!board) return <ErrorPage message="This board no longer exists." onRetry={undefined} />
        return <KanbanBoard board={board} onMoveCard={moveCard} />
      }
      case 'error':
        return <ErrorPage message={c.message} onRetry={c.query ? refresh : undefined} />
      case 'notfound':
        return <NotFoundPage />
    }
  }

  return (
    <div className="desktop">
      <div className="window ie-window">
        <TitleBar title={activeTab.title} />
        <MenuBar />
        <Toolbar
          busy={busy}
          onRefresh={refresh}
          onHome={goHome}
          canRefresh={!['home', 'board', 'notfound'].includes(activeTab.content.kind)}
        />
        <AddressBar key={activeTab.id + activeTab.url} url={activeTab.url} onNavigate={searchFromActiveTab} busy={busy} />
        <TabStrip tabs={tabs} activeTabId={activeTab.id} onSelect={activateTab} onClose={closeTab} onNew={openNewTab} />
        <div className="page-area">{renderContent(activeTab)}</div>
        <StatusBar text={status} busy={busy} />
      </div>
    </div>
  )
}
