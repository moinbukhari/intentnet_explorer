export function StatusBar({ text, busy }: { text: string; busy: boolean }) {
  return (
    <div className="status-bar">
      <p className="status-bar-field status-main">
        <span className="status-icon">🌐</span> {text}
      </p>
      <p className="status-bar-field status-progress">
        {busy && (
          <span className="progress-segments">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="segment" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </span>
        )}
      </p>
      <p className="status-bar-field status-zone">🌍 Internet</p>
    </div>
  )
}
