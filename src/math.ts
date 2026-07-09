// Detects arithmetic queries ("5x5", "what is 12 + 7 * 3") and evaluates
// them with a small recursive-descent parser — no eval, no network.

export interface MathResult {
  expression: string
  result: string
}

function parseExpression(s: string): number {
  let i = 0

  const skip = () => {
    while (s[i] === ' ') i++
  }

  function expr(): number {
    let v = term()
    skip()
    while (s[i] === '+' || s[i] === '-') {
      const op = s[i++]
      const t = term()
      v = op === '+' ? v + t : v - t
      skip()
    }
    return v
  }

  function term(): number {
    let v = power()
    skip()
    while (s[i] === '*' || s[i] === '/' || s[i] === '%') {
      const op = s[i++]
      const t = power()
      v = op === '*' ? v * t : op === '/' ? v / t : v % t
      skip()
    }
    return v
  }

  function power(): number {
    const base = unary()
    skip()
    if (s[i] === '^') {
      i++
      return base ** power()
    }
    return base
  }

  function unary(): number {
    skip()
    if (s[i] === '-') {
      i++
      return -unary()
    }
    if (s[i] === '+') {
      i++
      return unary()
    }
    return primary()
  }

  function primary(): number {
    skip()
    if (s[i] === '(') {
      i++
      const v = expr()
      skip()
      if (s[i] !== ')') throw new Error('unbalanced parens')
      i++
      return v
    }
    const match = /^\d+(\.\d+)?|^\.\d+/.exec(s.slice(i))
    if (!match) throw new Error('expected number')
    i += match[0].length
    return parseFloat(match[0])
  }

  const value = expr()
  skip()
  if (i !== s.length) throw new Error('trailing input')
  return value
}

export function formatNumber(n: number): string {
  if (!isFinite(n)) return 'Cannot divide by zero'
  return String(parseFloat(n.toPrecision(12)))
}

export function tryEvalMath(raw: string): MathResult | null {
  let s = raw.trim().toLowerCase()
  s = s.replace(/^(what\s+is|what's|whats|calculate|calc|compute|how\s+much\s+is)\s+/i, '')
  s = s.replace(/[=?\s]+$/g, '').trim()
  // "5x5" / "5 X 5" → multiplication; ÷ → /
  s = s.replace(/([\d)])\s*[x×]\s*(?=[\d(.])/gi, '$1*')
  s = s.replace(/÷/g, '/')

  if (!/^[\d\s+\-*/().^%]+$/.test(s)) return null
  // Needs a binary operator following a number/paren — a bare "404" isn't math
  if (!/[\d)]\s*[+\-*/^%]/.test(s)) return null

  try {
    const value = parseExpression(s)
    const expression = s.replace(/\*/g, ' × ').replace(/\//g, ' ÷ ').replace(/\s+/g, ' ').trim()
    return { expression, result: formatNumber(value) }
  } catch {
    return null
  }
}
