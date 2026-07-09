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

// Canned correct answers for the demo queries reachable from the homepage
// directory, so demo mode gives real information instead of placeholders.
const KNOWLEDGE_BASE = [
  {
    match: /capital of turkey/i,
    answer:
      'Ankara is the capital of Turkey. It became the capital in 1923 when the Republic of Turkey was founded — ' +
      'a common surprise, since Istanbul is the largest and most famous city, but Atatürk chose Ankara for its ' +
      'central, defensible location in Anatolia.',
    related: ['what is the capital of Australia', 'largest cities in Turkey', 'why is Istanbul not the capital'],
  },
  {
    match: /invented the telephone/i,
    answer:
      'Alexander Graham Bell was awarded the first patent for the telephone in March 1876, and made the famous ' +
      'first call to his assistant: "Mr. Watson, come here." Italian inventor Antonio Meucci built earlier ' +
      'voice-communication devices, and in 2002 the US Congress recognised his contribution.',
    related: ['who invented the internet', 'when was the first phone call', 'Antonio Meucci'],
  },
  {
    match: /is coffee healthy/i,
    answer:
      'For most adults, moderate coffee consumption (2-4 cups a day) is considered safe and is associated with ' +
      'reduced risk of type 2 diabetes, Parkinson\'s and liver disease. The main downsides are sleep disruption ' +
      'and dependence — and whatever you are doing to it with syrup.',
    related: ['how much caffeine is too much', 'is tea healthier than coffee', 'does coffee stunt growth'],
  },
  {
    match: /world wide web/i,
    answer:
      'The World Wide Web is an information system of pages linked by hypertext, invented by Tim Berners-Lee at ' +
      'CERN in 1989. It runs on top of the internet — the web is the pages, the internet is the pipes. The first ' +
      'website went live in 1991 and explained what the web was.',
    related: ['who invented the internet', 'what was the first website', 'web vs internet difference'],
  },
  {
    match: /y2k/i,
    answer:
      'The Y2K bug was a design flaw where computers stored years as two digits, so "00" could be read as 1900 ' +
      'instead of 2000, threatening date calculations everywhere. After an estimated $300+ billion of global ' +
      'remediation, midnight passed with only minor glitches — either a triumph of engineering or the best ' +
      'anticlimax in IT history.',
    related: ['what is the 2038 problem', 'biggest software bugs in history', 'how was y2k fixed'],
  },
  {
    match: /first movie ever made/i,
    answer:
      'The oldest surviving film is "Roundhay Garden Scene" (1888) by Louis Le Prince — about two seconds long. ' +
      'The Lumière brothers\' 1895 screenings in Paris, including "Workers Leaving the Factory", are usually ' +
      'counted as the birth of cinema as a public medium.',
    related: ['first movie with sound', 'who were the Lumière brothers', 'history of cinema'],
  },
  {
    match: /corporation tax/i,
    answer:
      'Corporation tax is the tax companies pay on their profits. In the UK the main rate is 25% (from April 2023), ' +
      'with a 19% small profits rate for companies making under £50,000. It is paid to HMRC, usually nine months ' +
      'and one day after the end of the accounting period.',
    related: ['how to register for corporation tax', 'what is VAT', 'sole trader vs limited company tax'],
  },
]

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

  const known = KNOWLEDGE_BASE.find((entry) => entry.match.test(q))
  if (known) {
    return {
      type: 'general_search',
      goal: null,
      confidence: 0.95,
      answer: known.answer,
      related: known.related,
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
