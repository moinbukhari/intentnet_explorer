const MENUS = ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help']

export function MenuBar() {
  return (
    <div className="menu-bar">
      {MENUS.map((m) => (
        <span key={m} className="menu-item">
          <u>{m[0]}</u>
          {m.slice(1)}
        </span>
      ))}
      <span className="menu-brand">
        Intent<b>Net</b>
      </span>
    </div>
  )
}
