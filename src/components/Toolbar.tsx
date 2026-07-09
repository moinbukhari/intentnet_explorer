interface ToolbarProps {
  busy: boolean
  canRefresh: boolean
  onRefresh: () => void
  onHome: () => void
}

function ToolButton({
  icon,
  label,
  disabled,
  onClick,
}: {
  icon: string
  label: string
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button className="tool-button" disabled={disabled} onClick={onClick} title={label}>
      <span className="tool-icon">{icon}</span>
      <span className="tool-label">{label}</span>
    </button>
  )
}

export function Toolbar({ busy, canRefresh, onRefresh, onHome }: ToolbarProps) {
  return (
    <div className="toolbar">
      <ToolButton icon="⬅️" label="Back" disabled />
      <ToolButton icon="➡️" label="Forward" disabled />
      <ToolButton icon="❌" label="Stop" disabled={!busy} />
      <ToolButton icon="🔄" label="Refresh" disabled={!canRefresh || busy} onClick={onRefresh} />
      <ToolButton icon="🏠" label="Home" disabled={busy} onClick={onHome} />
      <span className="toolbar-separator" />
      <ToolButton icon="🔍" label="Search" disabled />
      <ToolButton icon="⭐" label="Favorites" disabled />
      <ToolButton icon="🕒" label="History" disabled />
      <span className="toolbar-spacer" />
      <div className={`throbber${busy ? ' spinning' : ''}`} title={busy ? 'Working...' : 'Idle'}>
        🌐
      </div>
    </div>
  )
}
