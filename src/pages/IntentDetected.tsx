interface IntentDetectedProps {
  goal: string
  query: string
  onOpenBoard: () => void
}

export function IntentDetected({ goal, query, onOpenBoard }: IntentDetectedProps) {
  return (
    <div className="intent-page">
      <div className="window intent-dialog">
        <div className="title-bar">
          <div className="title-bar-text">IntentNet Agent</div>
          <div className="title-bar-controls">
            <button aria-label="Close" />
          </div>
        </div>
        <div className="window-body">
          <div className="intent-dialog-row">
            <span className="intent-dialog-icon">💡</span>
            <div>
              <p>
                <b>Actionable intent detected!</b>
              </p>
              <p>
                Your search <i>"{query}"</i> looks like something you want to <b>do</b>, not just know.
              </p>
              <p>
                The IntentNet Agent has generated a plan for: <b>{goal}</b>
              </p>
              <p>It has been opened in a new tab.</p>
            </div>
          </div>
          <section className="field-row intent-dialog-buttons">
            <button onClick={onOpenBoard}>Open my plan</button>
          </section>
        </div>
      </div>
    </div>
  )
}
