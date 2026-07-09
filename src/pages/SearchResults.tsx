import type { SearchResult } from '../types'

interface SearchResultsProps {
  result: SearchResult
  onSearch: (query: string) => void
}

export function SearchResults({ result, onSearch }: SearchResultsProps) {
  const fakeCount = (1_000_000 + (result.query.length * 137_421) % 9_000_000).toLocaleString()

  return (
    <div className="search-page">
      <div className="search-header">
        <span className="search-brand">
          Intent<b>Net</b> Search
        </span>
        <span className="search-meta">
          Results <b>1-1</b> of about <b>{fakeCount}</b> for <b>{result.query}</b> (0.23 seconds)
        </span>
      </div>

      {result.demo && (
        <div className="demo-notice">
          ⚠️ Demo mode: no <code>OPENAI_API_KEY</code> is configured on the server, so answers are placeholders.
        </div>
      )}

      <div className="search-result">
        <a href="#" className="result-title" onClick={(e) => e.preventDefault()}>
          {result.query} - IntentNet Answers
        </a>
        <div className="result-url">http://answers.intentnet/{encodeURIComponent(result.query.replace(/\s+/g, '-'))}</div>
        <p className="result-answer">{result.answer}</p>
      </div>

      {result.related.length > 0 && (
        <div className="related-searches">
          <b>Related searches:</b>
          <ul>
            {result.related.map((r) => (
              <li key={r}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onSearch(r)
                  }}
                >
                  {r}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="search-footer">No actionable intent detected in this query. It has been treated as a search.</p>
    </div>
  )
}
