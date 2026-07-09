import { Calculator } from '../components/Calculator'

interface CalcPageProps {
  query: string
  expression: string
  result: string
}

export function CalcPage({ query, expression, result }: CalcPageProps) {
  const logLines = [
    `> query received: "${query}"`,
    '> arithmetic detected — no internet required for this one',
    '> invoking tool: C:\\WINDOWS\\CALC.EXE',
    `> ${expression} = ${result}`,
    '> tool call complete (0.03s, 0 tokens, 0 pence)',
  ]

  return (
    <div className="calc-page">
      <div className="toolcall-console">
        <div className="toolcall-header">
          <span className="toolcall-badge">TOOL CALL</span> IntentNet Agent → calc.exe
        </div>
        <div className="toolcall-log">
          {logLines.map((line, i) => (
            <div key={i} className="toolcall-line" style={{ animationDelay: `${i * 0.45}s` }}>
              {line}
            </div>
          ))}
        </div>
      </div>

      <div className="calc-answer">
        {expression} = <b>{result}</b>
      </div>

      <Calculator initialValue={result} />

      <p className="calc-footer">The agent has left the calculator open in case you have follow-up sums.</p>
    </div>
  )
}
