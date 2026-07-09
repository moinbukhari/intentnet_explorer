import { useState } from 'react'
import { formatNumber } from '../math'

type BinaryOp = '+' | '-' | '*' | '/'

function apply(a: number, b: number, op: BinaryOp): number {
  switch (op) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '*':
      return a * b
    case '/':
      return a / b
  }
}

export function Calculator({ initialValue = '0' }: { initialValue?: string }) {
  const [display, setDisplay] = useState(initialValue)
  const [acc, setAcc] = useState<number | null>(null)
  const [op, setOp] = useState<BinaryOp | null>(null)
  const [fresh, setFresh] = useState(true)
  const [memory, setMemory] = useState(0)

  const cur = () => parseFloat(display) || 0

  const digit = (d: string) => {
    if (fresh) {
      setDisplay(d === '.' ? '0.' : d)
      setFresh(false)
    } else {
      if (d === '.' && display.includes('.')) return
      setDisplay(display === '0' && d !== '.' ? d : display + d)
    }
  }

  const chooseOp = (next: BinaryOp) => {
    if (op !== null && acc !== null && !fresh) {
      const r = apply(acc, cur(), op)
      setAcc(r)
      setDisplay(formatNumber(r))
    } else if (acc === null) {
      setAcc(cur())
    }
    setOp(next)
    setFresh(true)
  }

  const equals = () => {
    if (op !== null && acc !== null) {
      setDisplay(formatNumber(apply(acc, cur(), op)))
      setAcc(null)
      setOp(null)
    }
    setFresh(true)
  }

  const unary = (fn: (n: number) => number) => {
    setDisplay(formatNumber(fn(cur())))
    setFresh(true)
  }

  const clearAll = () => {
    setDisplay('0')
    setAcc(null)
    setOp(null)
    setFresh(true)
  }

  const clearEntry = () => {
    setDisplay('0')
    setFresh(true)
  }

  const backspace = () => {
    if (fresh) return
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0')
  }

  const key = (label: string, onClick: () => void, className = '') => (
    <button key={label} className={`calc-key ${className}`} onClick={onClick}>
      {label}
    </button>
  )

  return (
    <div className="calculator window">
      <div className="title-bar">
        <div className="title-bar-text">🧮 Calculator</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" />
          <button aria-label="Close" />
        </div>
      </div>
      <div className="window-body calc-body">
        <div className="calc-display">{display}</div>
        <div className="calc-memory-row">
          <span className="calc-memory-indicator">{memory !== 0 ? 'M' : ''}</span>
          {key('Backspace', backspace, 'red-key')}
          {key('CE', clearEntry, 'red-key')}
          {key('C', clearAll, 'red-key')}
        </div>
        <div className="calc-grid">
          {key('MC', () => setMemory(0), 'red-key')}
          {key('7', () => digit('7'))}
          {key('8', () => digit('8'))}
          {key('9', () => digit('9'))}
          {key('/', () => chooseOp('/'), 'op-key')}
          {key('sqrt', () => unary(Math.sqrt), 'op-key')}

          {key('MR', () => {
            setDisplay(formatNumber(memory))
            setFresh(true)
          }, 'red-key')}
          {key('4', () => digit('4'))}
          {key('5', () => digit('5'))}
          {key('6', () => digit('6'))}
          {key('*', () => chooseOp('*'), 'op-key')}
          {key('%', () => unary((n) => n / 100), 'op-key')}

          {key('MS', () => setMemory(cur()), 'red-key')}
          {key('1', () => digit('1'))}
          {key('2', () => digit('2'))}
          {key('3', () => digit('3'))}
          {key('-', () => chooseOp('-'), 'op-key')}
          {key('1/x', () => unary((n) => 1 / n), 'op-key')}

          {key('M+', () => setMemory(memory + cur()), 'red-key')}
          {key('0', () => digit('0'))}
          {key('+/-', () => unary((n) => -n))}
          {key('.', () => digit('.'))}
          {key('+', () => chooseOp('+'), 'op-key')}
          {key('=', equals, 'op-key equals-key')}
        </div>
      </div>
    </div>
  )
}
