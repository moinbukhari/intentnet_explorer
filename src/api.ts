import type { ClassifyResponse, GenerateBoardResponse } from './types'

// Same-origin by default (Vite proxy in dev, Express in prod). Set
// VITE_API_BASE at build time if the frontend is hosted apart from the API.
const API_BASE: string = import.meta.env.VITE_API_BASE ?? ''

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const data = await res.json()
      if (data.error) message = data.error
    } catch {
      // keep default message
    }
    throw new Error(message)
  }
  return res.json()
}

export function classify(query: string): Promise<ClassifyResponse> {
  return post('/api/classify', { query })
}

export function generateBoard(goal: string): Promise<GenerateBoardResponse> {
  return post('/api/generate-board', { goal })
}
