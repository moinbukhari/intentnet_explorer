// Demo mode: heuristic classifier + canned board generator used when no
// OPENAI_API_KEY is configured, so the app is fully demoable offline.

const INTENT_PATTERNS = [
  /^how (do|can|would|should) (i|you|we|one) /i,
  /^how to /i,
  /^(i want|i need|i'd like|i would like) to /i,
  /^help me /i,
  /^(best|easiest|fastest|cheapest) way to /i,
  /^(start|launch|build|create|learn|become|get|quit|move|plan|organi[sz]e|write|make|train|run|save|buy|sell|grow|find) /i,
  /^(starting|launching|building|learning|becoming|quitting|moving|planning|writing|making|training|running|saving|buying|selling|growing) /i,
]

const SEARCH_PATTERNS = [
  /^(what|who|when|where|why|which) /i,
  /^(is|are|was|were|does|do|did|can|could|has|have) /i,
  /^define /i,
  /\bmeaning of\b/i,
  /\bcapital of\b/i,
]

function extractGoal(query) {
  let goal = query.trim().replace(/\?+$/, '')
  goal = goal
    .replace(/^how (do|can|would|should) (i|you|we|one) /i, '')
    .replace(/^how to /i, '')
    .replace(/^(i want|i need|i'd like|i would like) to /i, '')
    .replace(/^help me (to )?/i, '')
    .replace(/^(best|easiest|fastest|cheapest) way to /i, '')
  return goal.charAt(0).toUpperCase() + goal.slice(1)
}

export function demoClassify(query) {
  const q = query.trim()
  const isSearch = SEARCH_PATTERNS.some((p) => p.test(q))
  const isIntent = INTENT_PATTERNS.some((p) => p.test(q))

  if (isIntent && !isSearch) {
    return {
      type: 'actionable_intent',
      goal: extractGoal(q),
      confidence: 0.85,
      answer: null,
    }
  }

  return {
    type: 'general_search',
    goal: null,
    confidence: isSearch ? 0.9 : 0.6,
    answer:
      `You searched for "${q}". IntentNet Explorer is running in demo mode ` +
      `(no OPENAI_API_KEY configured), so here is a placeholder answer instead of a real one. ` +
      `Add an API key to the server environment and this page will show a genuine AI-generated ` +
      `answer, complete with that unmistakable early-2000s search engine confidence.`,
    related: [
      `${q} for beginners`,
      `${q} explained`,
      `${q} free download no virus`,
    ],
  }
}

const BUSINESS_BOARD = {
  boardTitle: 'Start a business (UK)',
  cards: [
    {
      title: 'Write a one-page plan',
      description:
        'Skip the 40-page business plan. One page: what you sell, who buys it, what it costs, how you reach them. This is your MVP compass.',
      links: [],
    },
    {
      title: 'Choose a structure: sole trader vs limited company',
      description:
        'Sole trader is the least-resistance path (register with HMRC only). A limited company adds liability protection but more admin.',
      links: [{ label: 'GOV.UK guide', url: 'https://www.gov.uk/set-up-business' }],
    },
    {
      title: 'Register the company with Companies House',
      description:
        'Only if going limited. Online registration costs £50 and is usually approved within 24 hours. You will need a company name and a registered address.',
      links: [{ label: 'Companies House', url: 'https://www.gov.uk/limited-company-formation/register-your-company' }],
    },
    {
      title: 'Register with HMRC for tax',
      description:
        'Sole traders register for Self Assessment. Limited companies are registered for Corporation Tax as part of incorporation, but check your HMRC account.',
      links: [{ label: 'HMRC registration', url: 'https://www.gov.uk/register-for-self-assessment' }],
    },
    {
      title: 'Open a business bank account',
      description:
        'Tide, Starling or Monzo Business can open an account in a day from your phone. Keep business money separate from day one.',
      links: [
        { label: 'Tide', url: 'https://www.tide.co' },
        { label: 'Starling Business', url: 'https://www.starlingbank.com/business-account/' },
      ],
    },
    {
      title: 'Sort minimum viable admin',
      description:
        'Basic bookkeeping (a spreadsheet is fine to start), invoice template, and check if you need insurance (public liability / professional indemnity).',
      links: [],
    },
    {
      title: 'Get your first paying customer',
      description:
        'Everything before this was overhead. Sell the simplest version of your offer to one real person. Revenue validates the business.',
      links: [],
    },
  ],
}

export function demoGenerateBoard(goal) {
  if (/business/i.test(goal)) {
    return BUSINESS_BOARD
  }

  return {
    boardTitle: goal,
    cards: [
      {
        title: `Define what "done" looks like for: ${goal}`,
        description:
          'Write one sentence describing the smallest outcome that would count as success. This keeps the plan an MVP, not a life project.',
        links: [],
      },
      {
        title: 'Research the minimal path (30 minutes, timeboxed)',
        description:
          'Find the 2-3 things people who did this say actually mattered. Ignore everything else for now.',
        links: [],
      },
      {
        title: 'Do the first concrete action',
        description:
          'The smallest real-world step you can take today: sign up, book, buy, message someone, or create the first artifact.',
        links: [],
      },
      {
        title: 'Remove the biggest blocker',
        description:
          'Identify the one thing most likely to stop you (money, time, permission, skill) and handle just enough of it to keep moving.',
        links: [],
      },
      {
        title: 'Ship the MVP version',
        description:
          `Complete the smallest end-to-end version of "${goal}". Imperfect and finished beats perfect and abandoned.`,
        links: [],
      },
      {
        title: 'Review and decide next step',
        description:
          'Did the MVP get you what you wanted? Decide: double down, adjust, or declare victory and archive this board.',
        links: [],
      },
    ],
  }
}
