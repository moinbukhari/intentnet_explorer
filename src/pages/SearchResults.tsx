import type { SearchResult } from '../types'
import { getModel } from '../models'

interface SearchResultsProps {
  result: SearchResult
  onSearch: (query: string) => void
  onOpen404: () => void
}

const ADS = [
  { icon: '🐒', text: 'PUNCH THE MONKEY and WIN $50!!! (you will not win $50)' },
  { icon: '💾', text: 'DOWNLOAD MORE RAM — 100% free, 0% real, 56k compatible!' },
  { icon: '📀', text: 'FREE INTERNET CD: 1,000 hours (first 45 minutes free)' },
  { icon: '📟', text: 'HOT DEALS on 56k modems in YOUR area code — click NOW!' },
  { icon: '🧠', text: 'IntentNet PREMIUM: now with TWO tabs at the SAME TIME' },
]

function pickAd(query: string) {
  let hash = 0
  for (const ch of query) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return ADS[hash % ADS.length]
}

export function SearchResults({ result, onSearch, onOpen404 }: SearchResultsProps) {
  const fakeCount = (1_000_000 + (result.query.length * 137_421) % 9_000_000).toLocaleString()
  const model = getModel(result.model)
  const ad = pickAd(result.query)

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

      <div className="search-result">
        <a href="#" className="result-title" onClick={(e) => e.preventDefault()}>
          {result.query} - IntentNet Answers
        </a>
        <div className="result-url">http://answers.intentnet/{encodeURIComponent(result.query.replace(/\s+/g, '-'))}</div>
        <p className="result-answer">{result.answer}</p>
        <p className="result-attribution">
          {model.icon} Answered by <b>{model.name}</b> — <i>"{model.catchphrase}"</i>
          {result.demo && ' (demo mode)'}
        </p>
      </div>

      <button className="result-ad" onClick={onOpen404}>
        <span className="result-ad-label">SPONSORED</span>
        <span className="result-ad-text">
          {ad.icon} {ad.text}
        </span>
      </button>

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
