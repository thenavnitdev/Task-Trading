import type { PerformanceStats } from '../types'
import { formatCurrency, formatPercent, pnlClass } from '../utils/format'
import { MetricCard } from './MetricCard'

interface PerformancePanelProps {
  stats: PerformanceStats
}

export function PerformancePanel({ stats }: PerformancePanelProps) {
  return (
    <section className="panel equal-card" aria-labelledby="performance-heading">
      <div className="panel-header">
        <h2 id="performance-heading">Trading performance</h2>
        <p>All metrics are calculated from the trade list</p>
      </div>
      <div className="metric-grid metric-grid-fill">
        <MetricCard
          label="Total P&L"
          value={
            <span className={pnlClass(stats.totalPnl)}>
              {formatCurrency(stats.totalPnl, { signed: true })}
            </span>
          }
          tone={
            stats.totalPnl > 0
              ? 'positive'
              : stats.totalPnl < 0
                ? 'negative'
                : 'default'
          }
        />
        <MetricCard label="Winning trades" value={stats.winningTrades} />
        <MetricCard label="Losing trades" value={stats.losingTrades} />
        <MetricCard
          label="Win rate"
          value={
            stats.totalTrades === 0 ? '—' : formatPercent(stats.winRate)
          }
        />
        <MetricCard
          label="Largest winning trade"
          value={
            stats.largestWinningTrade === null ? (
              '—'
            ) : (
              <span className="positive">
                {formatCurrency(stats.largestWinningTrade, { signed: true })}
              </span>
            )
          }
          tone="positive"
        />
        <MetricCard
          label="Largest losing trade"
          value={
            stats.largestLosingTrade === null ? (
              '—'
            ) : (
              <span className="negative">
                {formatCurrency(stats.largestLosingTrade, { signed: true })}
              </span>
            )
          }
          tone="negative"
        />
      </div>
    </section>
  )
}
