import type { EquityPoint } from '../types'
import { formatCurrency } from '../utils/format'

interface EquityCurveProps {
  points: EquityPoint[]
  startingBalance: number
}

/**
 * Additional product feature: a simple equity curve so the trader can
 * see how balance moved trade-by-trade and where the high-water mark sits.
 */
export function EquityCurve({ points, startingBalance }: EquityCurveProps) {
  if (points.length < 2) {
    return (
      <section className="panel" aria-labelledby="equity-heading">
        <div className="panel-header">
          <h2 id="equity-heading">Equity curve</h2>
          <p>Balance path across closed trades</p>
        </div>
        <p className="empty-state">Need at least one trade to plot equity.</p>
      </section>
    )
  }

  const width = 640
  const height = 220
  const padX = 16
  const padY = 20

  const balances = points.map((point) => point.balance)
  const minBalance = Math.min(...balances, startingBalance)
  const maxBalance = Math.max(...balances, startingBalance)
  const range = Math.max(maxBalance - minBalance, 1)

  const coords = points.map((point, index) => {
    const x =
      padX + (index / (points.length - 1)) * (width - padX * 2)
    const y =
      height - padY - ((point.balance - minBalance) / range) * (height - padY * 2)
    return { x, y, ...point }
  })

  const linePath = coords
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - padY} L ${coords[0].x} ${height - padY} Z`

  const peak = Math.max(...balances)
  const latest = points[points.length - 1]
  const peakPoint = coords.reduce((best, point) =>
    point.balance > best.balance ? point : best,
  )

  return (
    <section className="panel" aria-labelledby="equity-heading">
      <div className="panel-header">
        <h2 id="equity-heading">Equity curve</h2>
        <p>
          Peak {formatCurrency(peak)} · Now{' '}
          {formatCurrency(latest.balance)}
        </p>
      </div>

      <div className="equity-chart" aria-hidden="true">
        <svg viewBox={`0 0 ${width} ${height}`} role="img">
          <title>Account equity over trades</title>
          <defs>
            <linearGradient id="equityStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6c7cff" />
              <stop offset="55%" stopColor="#5ef0c8" />
              <stop offset="100%" stopColor="#9ff5df" />
            </linearGradient>
            <linearGradient id="equityFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(94, 240, 200, 0.35)" />
              <stop offset="100%" stopColor="rgba(94, 240, 200, 0)" />
            </linearGradient>
          </defs>
          <line
            className="equity-baseline"
            x1={padX}
            y1={height - padY - ((startingBalance - minBalance) / range) * (height - padY * 2)}
            x2={width - padX}
            y2={height - padY - ((startingBalance - minBalance) / range) * (height - padY * 2)}
          />
          <path className="equity-area" d={areaPath} />
          <path className="equity-line" d={linePath} />
          <circle
            className="equity-peak"
            cx={peakPoint.x}
            cy={peakPoint.y}
            r="4"
          />
          <circle
            className="equity-latest"
            cx={coords[coords.length - 1].x}
            cy={coords[coords.length - 1].y}
            r="4.5"
          />
        </svg>
      </div>

      <ol className="equity-legend">
        {points.map((point) => (
          <li key={`${point.label}-${point.balance}`}>
            <span>{point.label}</span>
            <strong className={point.balance >= startingBalance ? 'positive' : 'negative'}>
              {formatCurrency(point.balance)}
            </strong>
          </li>
        ))}
      </ol>
    </section>
  )
}
