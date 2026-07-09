import type { ClassifyResponse, GenerateBoardResponse } from './types'

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
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
