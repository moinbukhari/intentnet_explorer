import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'
import type { Board, Tab } from './types'

const KEY = 'intentnet-state-v1'
const isNative = Capacitor.isNativePlatform()

// iOS can evict WKWebView localStorage under storage pressure, so native
// builds mirror state to Capacitor Preferences (backed by NSUserDefaults)
// and restore from it on launch. On the web this is a no-op.
export async function hydrateFromNativeStorage(): Promise<void> {
  if (!isNative || localStorage.getItem(KEY)) return
  try {
    const { value } = await Preferences.get({ key: KEY })
    if (value) localStorage.setItem(KEY, value)
  } catch {
    // best-effort; the app still works from a fresh state
  }
}

export interface PersistedState {
  tabs: Tab[]
  activeTabId: string
  boards: Record<string, Board>
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
        return state
      }
    }
  } catch {
    // fall through to fresh state
  }
  const home = newHomeTab()
  return { tabs: [home], activeTabId: home.id, boards: {} }
}

export function saveState(state: PersistedState) {
  try {
    const json = JSON.stringify(state)
    localStorage.setItem(KEY, json)
    if (isNative) void Preferences.set({ key: KEY, value: json })
  } catch {
    // storage full or unavailable; persistence is best-effort
  }
}
