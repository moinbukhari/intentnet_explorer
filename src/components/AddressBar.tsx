import { useState } from 'react'

interface AddressBarProps {
  url: string
  busy: boolean
  onNavigate: (query: string) => void
}

export function AddressBar({ url, busy, onNavigate }: AddressBarProps) {
  const [value, setValue] = useState(url)

  return (
    <form
      className="address-bar"
      onSubmit={(e) => {
        e.preventDefault()
        onNavigate(value)
      }}
    >
      <label htmlFor="address-input">A<u>d</u>dress</label>
      <div className="address-input-wrap">
        <span className="address-favicon">🌐</span>
        <input
          id="address-input"
          type="text"
          value={value}
          disabled={busy}
          onChange={(e) => setValue(e.target.value)}
          onFocus={(e) => e.target.select()}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <button type="submit" disabled={busy} className="go-button">
        <span className="go-arrow">➜</span> Go
      </button>
    </form>
  )
}
