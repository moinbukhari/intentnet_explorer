import { Minesweeper } from '../components/Minesweeper'

export function NotFoundPage() {
  return (
    <div className="notfound-page">
      <h1>404 — The page cannot be found</h1>
      <p>
        The page you requested may have been deleted, renamed, or devoured by a dial-up modem. It happens more than
        you'd think.
      </p>
      <p className="notfound-hint">
        In the grand tradition of error-page games: while the internet finds itself, please enjoy a round of
        Minesweeper.
      </p>
      <Minesweeper />
      <p className="notfound-footer">HTTP 404 · intentnet://lost · IntentNet Explorer</p>
    </div>
  )
}
