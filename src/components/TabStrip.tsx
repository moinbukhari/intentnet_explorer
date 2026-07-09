import type { Tab } from '../types'

interface TabStripProps {
  tabs: Tab[]
  activeTabId: string
  onSelect: (tabId: string) => void
  onClose: (tabId: string) => void
  onNew: () => void
}

const TAB_ICONS: Record<Tab['content']['kind'], string> = {
  home: '🏠',
  loading: '⏳',
  search: '📄',
  intent: '💡',
  board: '📋',
  error: '⚠️',
  notfound: '💣',
}

export function TabStrip({ tabs, activeTabId, onSelect, onClose, onNew }: TabStripProps) {
  return (
    <div className="tab-strip">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`browser-tab${tab.id === activeTabId ? ' active' : ''}`}
          onClick={() => onSelect(tab.id)}
          onAuxClick={(e) => {
            if (e.button === 1) onClose(tab.id)
          }}
          title={tab.title}
        >
          <span className="tab-icon">{TAB_ICONS[tab.content.kind]}</span>
          <span className="tab-title">{tab.title}</span>
          <button
            className="tab-close"
            onClick={(e) => {
              e.stopPropagation()
              onClose(tab.id)
            }}
            aria-label="Close tab"
          >
            ×
          </button>
        </div>
      ))}
      <button className="tab-new" onClick={onNew} title="New tab">
        +
      </button>
    </div>
  )
}
