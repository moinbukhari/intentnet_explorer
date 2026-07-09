interface ErrorPageProps {
  message: string
  onRetry?: () => void
}

export function ErrorPage({ message, onRetry }: ErrorPageProps) {
  return (
    <div className="error-page">
      <h1>The page cannot be displayed</h1>
      <p>
        The page you are looking for is currently unavailable. The IntentNet Agent might be experiencing technical
        difficulties, or you may need to adjust your server settings.
      </p>
      <hr />
      <p>Please try the following:</p>
      <ul>
        <li>
          Click the <b>Refresh</b> button, or try again later.
        </li>
        <li>
          If the server is in demo mode, add an <code>OPENAI_API_KEY</code> to its environment for real answers.
        </li>
        <li>Check that the IntentNet server is running on port 3001.</li>
        <li>Blow gently into the cartridge and reinsert it.</li>
      </ul>
      <p className="error-detail">
        Technical information: <code>{message}</code>
      </p>
      {onRetry && (
        <button onClick={onRetry} className="error-retry">
          🔄 Try again
        </button>
      )}
      <p className="error-footer">IntentNet Explorer</p>
    </div>
  )
}
