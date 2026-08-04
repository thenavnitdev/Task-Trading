import type { RiskMetrics } from '../types'
import { getRiskBudget } from '../utils/calculations'
import { formatCurrency, formatPercent } from '../utils/format'
import { StatusBadge } from './StatusBadge'

interface RiskIndicatorProps {
  risk: RiskMetrics
  maximumDrawdown: number
  dailyLossLimit: number
}

export function RiskIndicator({
  risk,
  maximumDrawdown,
  dailyLossLimit,
}: RiskIndicatorProps) {
  const budget = getRiskBudget(risk)
  const limitingLabel =
    risk.limitingFactor === 'drawdown'
      ? 'drawdown rule'
      : risk.limitingFactor === 'daily'
        ? 'daily loss rule'
        : 'account rules'

  return (
    <section className="panel risk-panel" aria-labelledby="risk-heading">
      <div className="panel-header risk-header">
        <div>
          <h2 id="risk-heading">Rule risk</h2>
          <p>Can I keep trading without breaking evaluation rules?</p>
        </div>
        <StatusBadge status={risk.status} />
      </div>

      <div className="risk-budget">
        <p className="metric-label">Remaining risk budget</p>
        <p className="risk-budget-value">{formatCurrency(budget)}</p>
        <p className="metric-hint">
          Tightest leftover room under your {limitingLabel}. Lose more than this
          and you breach a rule.
        </p>
      </div>

      <div className="risk-meters">
        <RiskMeter
          title="Drawdown"
          used={risk.currentDrawdown}
          remaining={risk.remainingDrawdown}
          limit={maximumDrawdown}
          utilization={risk.drawdownUtilization}
        />
        <RiskMeter
          title="Daily loss"
          used={risk.currentDayLoss}
          remaining={risk.remainingDailyLoss}
          limit={dailyLossLimit}
          utilization={risk.dailyLossUtilization}
        />
      </div>
    </section>
  )
}

interface RiskMeterProps {
  title: string
  used: number
  remaining: number
  limit: number
  utilization: number
}

function RiskMeter({
  title,
  used,
  remaining,
  limit,
  utilization,
}: RiskMeterProps) {
  const pct = Math.min(100, Math.max(0, utilization * 100))
  const barTone =
    utilization >= 0.8 ? 'danger' : utilization >= 0.5 ? 'warn' : 'ok'

  return (
    <div className="risk-meter">
      <div className="risk-meter-top">
        <h3>{title}</h3>
        <span>{formatPercent(pct, 0)} used</span>
      </div>
      <div
        className="meter-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label={`${title} utilization`}
      >
        <div
          className={`meter-fill meter-${barTone}`}
          style={{ ['--meter-target' as string]: `${pct}%` }}
        />
      </div>
      <dl className="risk-meter-stats">
        <div>
          <dt>Current</dt>
          <dd>{formatCurrency(used)}</dd>
        </div>
        <div>
          <dt>Remaining</dt>
          <dd>{formatCurrency(remaining)}</dd>
        </div>
        <div>
          <dt>Limit</dt>
          <dd>{formatCurrency(limit)}</dd>
        </div>
      </dl>
    </div>
  )
}
