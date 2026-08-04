import type { PerformanceStats, ProfitLossSummary, Trade } from '../types'
import { formatCurrency, formatPercent } from '../utils/format'

interface PnLChartsProps {
  trades: Trade[]
  summary: ProfitLossSummary
  performance: PerformanceStats
}

export function PnLCharts({ trades, summary, performance }: PnLChartsProps) {
  const maxAbsTrade =
    trades.length === 0
      ? 1
      : Math.max(...trades.map((trade) => Math.abs(trade.pnl)), 1)

  const comparisonMax = Math.max(summary.grossProfit, summary.grossLoss, 1)
  const totalSides = summary.grossProfit + summary.grossLoss
  const profitShare = totalSides === 0 ? 0 : (summary.grossProfit / totalSides) * 100
  const lossShare = totalSides === 0 ? 0 : (summary.grossLoss / totalSides) * 100

  const donut = buildDonut(performance.winningTrades, performance.losingTrades)

  return (
    <section className="panel pnl-charts-panel" aria-labelledby="pnl-charts-heading">
      <div className="panel-header">
        <div>
          <h2 id="pnl-charts-heading">Profit &amp; loss charts</h2>
          <p>Gross wins vs losses — both sides of the ledger</p>
        </div>
        <div className="pnl-net-chip">
          Net{' '}
          <strong className={summary.netPnl >= 0 ? 'positive' : 'negative'}>
            {formatCurrency(summary.netPnl, { signed: true })}
          </strong>
        </div>
      </div>

      <div className="pnl-summary-row">
        <article className="pnl-stat profit">
          <p className="metric-label">Gross profit</p>
          <p className="metric-value positive">
            {formatCurrency(summary.grossProfit, { signed: true })}
          </p>
          <p className="metric-hint">
            Avg win{' '}
            {summary.averageWin === null
              ? '—'
              : formatCurrency(summary.averageWin, { signed: true })}
          </p>
        </article>
        <article className="pnl-stat loss">
          <p className="metric-label">Gross loss</p>
          <p className="metric-value negative">
            {formatCurrency(-summary.grossLoss, { signed: true })}
          </p>
          <p className="metric-hint">
            Avg loss{' '}
            {summary.averageLoss === null
              ? '—'
              : formatCurrency(summary.averageLoss, { signed: true })}
          </p>
        </article>
        <article className="pnl-stat">
          <p className="metric-label">Profit factor</p>
          <p className="metric-value">
            {summary.profitFactor === null
              ? summary.grossProfit > 0
                ? '∞'
                : '—'
              : summary.profitFactor.toFixed(2)}
          </p>
          <p className="metric-hint">Gross profit ÷ gross loss</p>
        </article>
      </div>

      <div className="pnl-charts-grid">
        <div className="chart-block">
          <h3>Trade P&amp;L bars</h3>
          {trades.length === 0 ? (
            <p className="empty-state">No trades to chart.</p>
          ) : (
            <div className="pnl-bar-chart" role="img" aria-label="Profit and loss by trade">
              {trades.map((trade, index) => {
                const height = (Math.abs(trade.pnl) / maxAbsTrade) * 100
                const isWin = trade.pnl >= 0
                return (
                  <div
                    className="pnl-bar-col"
                    key={trade.id}
                    style={{ animationDelay: `${0.35 + index * 0.08}s` }}
                  >
                    <span className={`pnl-bar-value ${isWin ? 'positive' : 'negative'}`}>
                      {formatCurrency(trade.pnl, { signed: true })}
                    </span>
                    <div className="pnl-bar-track">
                      <div
                        className={`pnl-bar ${isWin ? 'win' : 'loss'}`}
                        style={{ height: `${Math.max(height, 6)}%` }}
                      />
                    </div>
                    <span className="pnl-bar-label">
                      {trade.symbol}
                      <small>{trade.side}</small>
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="chart-block">
          <h3>Gross profit vs loss</h3>
          <div className="compare-bars" role="img" aria-label="Gross profit versus gross loss">
            <div className="compare-row">
              <div className="compare-meta">
                <span>Profit</span>
                <strong className="positive">{formatCurrency(summary.grossProfit)}</strong>
              </div>
              <div className="compare-track">
                <div
                  className="compare-fill win"
                  style={{
                    ['--bar-target' as string]: `${(summary.grossProfit / comparisonMax) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="compare-row">
              <div className="compare-meta">
                <span>Loss</span>
                <strong className="negative">{formatCurrency(summary.grossLoss)}</strong>
              </div>
              <div className="compare-track">
                <div
                  className="compare-fill loss"
                  style={{
                    ['--bar-target' as string]: `${(summary.grossLoss / comparisonMax) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="share-strip" aria-hidden="true">
              <div className="share-profit" style={{ width: `${profitShare}%` }} />
              <div className="share-loss" style={{ width: `${lossShare}%` }} />
            </div>
            <p className="metric-hint">
              {formatPercent(profitShare, 0)} of absolute move from wins ·{' '}
              {formatPercent(lossShare, 0)} from losses
            </p>
          </div>
        </div>

        <div className="chart-block donut-block">
          <h3>Win / loss mix</h3>
          <div className="donut-wrap">
            <svg viewBox="0 0 120 120" className="donut-svg" role="img">
              <title>
                {performance.winningTrades} wins and {performance.losingTrades} losses
              </title>
              <circle className="donut-track" cx="60" cy="60" r="42" />
              {donut.segments.map((segment) => (
                <circle
                  key={segment.key}
                  className={`donut-segment ${segment.key}`}
                  cx="60"
                  cy="60"
                  r="42"
                  strokeDasharray={`${segment.length} ${donut.circumference - segment.length}`}
                  strokeDashoffset={segment.offset}
                />
              ))}
            </svg>
            <div className="donut-center">
              <strong>{formatPercent(performance.winRate, 0)}</strong>
              <span>win rate</span>
            </div>
          </div>
          <ul className="donut-legend">
            <li>
              <span className="swatch win" />
              Wins · {performance.winningTrades}
            </li>
            <li>
              <span className="swatch loss" />
              Losses · {performance.losingTrades}
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function buildDonut(wins: number, losses: number) {
  const total = wins + losses
  const circumference = 2 * Math.PI * 42

  if (total === 0) {
    return { circumference, segments: [] as Array<{ key: string; length: number; offset: number }> }
  }

  const winLength = (wins / total) * circumference
  const lossLength = (losses / total) * circumference

  return {
    circumference,
    segments: [
      {
        key: 'win',
        length: winLength,
        // Start at top
        offset: circumference * 0.25,
      },
      {
        key: 'loss',
        length: lossLength,
        offset: circumference * 0.25 - winLength,
      },
    ],
  }
}
