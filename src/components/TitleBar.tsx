export function TitleBar({ title }: { title: string }) {
  return (
    <div className="title-bar">
      <div className="title-bar-text">
        <span className="title-bar-icon">🌐</span>
        {title} - IntentNet Explorer
      </div>
      <div className="title-bar-controls">
        <button aria-label="Minimize" />
        <button aria-label="Maximize" />
        <button aria-label="Close" />
      </div>
    </div>
  )
}
