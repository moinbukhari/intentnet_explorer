import type { Board, Tab } from './types'
import { DEFAULT_MODEL } from './models'

const KEY = 'intentnet-state-v1'

export interface PersistedState {
  tabs: Tab[]
  activeTabId: string
  boards: Record<string, Board>
  model: string
}

export function newHomeTab(): Tab {
  return {
    id: crypto.randomUUID(),
    title: 'IntentNet Start',
    url: 'intentnet://home',
    content: { kind: 'home' },
  }
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const state = JSON.parse(raw) as PersistedState
      // A reload mid-navigation leaves loading tabs behind; reset them to home.
      state.tabs = state.tabs.map((t) =>
        t.content.kind === 'loading'
          ? { ...t, title: 'IntentNet Start', url: 'intentnet://home', content: { kind: 'home' as const } }
          : t,
      )
      if (state.tabs.length > 0 && state.tabs.some((t) => t.id === state.activeTabId)) {
        return { ...state, model: state.model ?? DEFAULT_MODEL }
      }
    }
  } catch {
    // fall through to fresh state
  }
  const home = newHomeTab()
  return { tabs: [home], activeTabId: home.id, boards: {}, model: DEFAULT_MODEL }
}

export function saveState(state: PersistedState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable; persistence is best-effort
  }
}
