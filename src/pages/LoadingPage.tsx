export function LoadingPage({ query, stage }: { query: string; stage: string }) {
  return (
    <div className="loading-page">
      <div className="loading-globe">🌐</div>
      <p className="loading-title">Connecting to intentnet://agent ...</p>
      <p className="loading-query">"{query}"</p>
      <p className="loading-stage">{stage}</p>
      <div className="loading-bar">
        <div className="loading-bar-fill" />
      </div>
      <p className="loading-hint">Estimated time remaining: somewhere between 3 seconds and a dial-up eternity</p>
    </div>
  )
}
