import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { demoClassify, demoGenerateBoard } from './demo.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

const apiKey = process.env.OPENAI_API_KEY
let openai = null
if (apiKey) {
  const { default: OpenAI } = await import('openai')
  openai = new OpenAI({ apiKey })
}

const app = express()
app.use(express.json())

// The native iOS app serves its UI from capacitor://localhost and calls this
// API cross-origin, so CORS must be open (the API holds no user data).
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

const CLASSIFY_SYSTEM = `You are the intent engine behind "IntentNet Explorer", a retro browser that turns actionable goals into Kanban boards.

Classify the user's query as one of:
- "actionable_intent": the user wants to ACCOMPLISH something in the real world that takes multiple steps (e.g. "how do I start a business", "I want to run a marathon", "move to Spain"). A project you could plan.
- "general_search": an informational question, fact lookup, definition, opinion, or anything that is answered rather than done (e.g. "what is the capital of Turkey", "who invented the telephone", "is coffee healthy"). Simple single-action how-tos ("how do I tie a tie") also count as general_search.

Respond with strict JSON:
{
  "type": "actionable_intent" | "general_search",
  "goal": string | null,        // for intents: the goal as a short imperative phrase, e.g. "Start a business in the UK". null for searches.
  "confidence": number,          // 0-1
  "answer": string | null,       // for searches: a helpful, concise answer (2-4 sentences). null for intents.
  "related": string[] | null     // for searches: 3 related query suggestions. null for intents.
}`

const BOARD_SYSTEM = `You generate minimal, practical Kanban boards for "IntentNet Explorer". Given a goal, produce the MINIMUM VIABLE PATH to achieve it: the least-resistance ordered sequence of concrete steps, not an exhaustive checklist. 5-8 cards.

Rules:
- Steps must be concrete and real-world specific: name actual services, institutions, websites and rough costs where relevant (e.g. for starting a UK business: Companies House, HMRC, Tide bank account).
- Order cards by what to do first.
- Include real, well-known URLs in links where genuinely useful. Never invent URLs.
- Keep descriptions to 1-3 punchy sentences.

Respond with strict JSON:
{
  "boardTitle": string,
  "cards": [
    { "title": string, "description": string, "links": [{ "label": string, "url": string }] }
  ]
}`

async function callJson(system, user) {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  })
  return JSON.parse(completion.choices[0].message.content)
}

const PERSONA_NOTES = {
  jeeves: 'When writing the "answer" field, adopt the voice of Ask Jeeves: an impeccably polite English butler.',
  clippy:
    'When writing the "answer" field, adopt the voice of Clippy: an overeager assistant. Begin with "It looks like..."',
  yahoogpt:
    'When writing the "answer" field, adopt the voice of YahooGPT-2001: breathless turn-of-the-millennium web-portal enthusiasm.',
}

app.post('/api/classify', async (req, res) => {
  const query = (req.body?.query || '').toString().trim()
  if (!query) return res.status(400).json({ error: 'query is required' })

  try {
    if (!openai) {
      return res.json({ ...demoClassify(query), demo: true })
    }
    const persona = PERSONA_NOTES[req.body?.model]
    const system = persona ? `${CLASSIFY_SYSTEM}\n\n${persona}` : CLASSIFY_SYSTEM
    let result
    try {
      result = await callJson(system, query)
    } catch {
      result = await callJson(system, query) // one retry on malformed JSON / transient error
    }
    if (result.type !== 'actionable_intent' && result.type !== 'general_search') {
      throw new Error('bad classification shape')
    }
    res.json(result)
  } catch (err) {
    console.error('classify failed:', err)
    res.status(502).json({ error: 'The intent engine could not be reached.' })
  }
})

app.post('/api/generate-board', async (req, res) => {
  const goal = (req.body?.goal || '').toString().trim()
  if (!goal) return res.status(400).json({ error: 'goal is required' })

  try {
    if (!openai) {
      return res.json({ ...demoGenerateBoard(goal), demo: true })
    }
    let result
    try {
      result = await callJson(BOARD_SYSTEM, goal)
    } catch {
      result = await callJson(BOARD_SYSTEM, goal)
    }
    if (!result.boardTitle || !Array.isArray(result.cards) || result.cards.length === 0) {
      throw new Error('bad board shape')
    }
    result.cards = result.cards.map((c) => ({
      title: String(c.title || 'Untitled step'),
      description: String(c.description || ''),
      links: Array.isArray(c.links)
        ? c.links.filter((l) => l && l.url && l.label).map((l) => ({ label: String(l.label), url: String(l.url) }))
        : [],
    }))
    res.json(result)
  } catch (err) {
    console.error('generate-board failed:', err)
    res.status(502).json({ error: 'The plan generator could not be reached.' })
  }
})

if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, '..', 'dist')
  app.use(express.static(dist))
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`IntentNet server on http://localhost:${PORT} (${openai ? `OpenAI: ${MODEL}` : 'demo mode - no OPENAI_API_KEY'})`)
})
