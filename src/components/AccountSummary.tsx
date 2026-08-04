import type { AccountRules, PerformanceStats } from '../types'
import { formatCurrency, pnlClass } from '../utils/format'
import { MetricCard } from './MetricCard'

interface AccountSummaryProps {
  rules: AccountRules
  performance: PerformanceStats
}

export function AccountSummary({ rules, performance }: AccountSummaryProps) {
  return (
    <section className="panel equal-card" aria-labelledby="account-heading">
      <div className="panel-header">
        <h2 id="account-heading">Account</h2>
        <p>Evaluation rules and live balance</p>
      </div>
      <div className="metric-grid metric-grid-fill">
        <MetricCard
          label="Starting balance"
          value={formatCurrency(rules.startingBalance)}
        />
        <MetricCard
          label="Current balance"
          value={
            <span className={pnlClass(performance.totalPnl)}>
              {formatCurrency(performance.currentBalance)}
            </span>
          }
          hint={`Derived from starting balance + trade P&L`}
          tone={
            performance.totalPnl > 0
              ? 'positive'
              : performance.totalPnl < 0
                ? 'negative'
                : 'default'
          }
        />
        <MetricCard
          label="Maximum drawdown"
          value={formatCurrency(rules.maximumDrawdown)}
          hint="Max decline allowed from peak equity"
        />
        <MetricCard
          label="Daily loss limit"
          value={formatCurrency(rules.dailyLossLimit)}
          hint="Max net loss allowed today"
        />
      </div>
    </section>
  )
}
