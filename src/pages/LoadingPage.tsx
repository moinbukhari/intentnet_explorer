import { useEffect, useState } from 'react'

const STALL_LINES = [
  'Still connecting... please remain calm.',
  'Negotiating with the modem (it is winning).',
  'Reticulating splines...',
  'Untangling the phone cord...',
  'Asking someone to get off the phone...',
]

export function LoadingPage({ query, stage }: { query: string; stage: string }) {
  const [progress, setProgress] = useState(0)
  const [stallLine, setStallLine] = useState(0)

  // Climb briskly, then crawl, then get stuck at 90%. As is tradition.
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return 90
        const step = p < 60 ? 4 : p < 82 ? 1.8 : 0.7
        return Math.min(90, p + step)
      })
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const stuck = progress >= 90
  useEffect(() => {
    if (!stuck) return
    const interval = setInterval(() => setStallLine((i) => (i + 1) % STALL_LINES.length), 1500)
    return () => clearInterval(interval)
  }, [stuck])

  return (
    <div className="loading-page">
      <div className="loading-globe">🌐</div>
      <p className="loading-title">Connecting to intentnet://agent ...</p>
      <p className="loading-query">"{query}"</p>
      <p className="loading-stage">{stage}</p>
      <div className="loading-bar">
        <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="loading-percent">{Math.floor(progress)}%</p>
      {stuck ? (
        <p className="loading-hint">{STALL_LINES[stallLine]}</p>
      ) : (
        <p className="loading-hint">Estimated time remaining: 1 minute (it is lying)</p>
      )}
    </div>
  )
}
