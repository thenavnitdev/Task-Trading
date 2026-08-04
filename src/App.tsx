import { AccountSummary } from './components/AccountSummary'
import { AssetBreakdown } from './components/AssetBreakdown'
import { EquityCurve } from './components/EquityCurve'
import { PerformancePanel } from './components/PerformancePanel'
import { PnLCharts } from './components/PnLCharts'
import { RiskIndicator } from './components/RiskIndicator'
import { SiteFooter } from './components/SiteFooter'
import { TradeList } from './components/TradeList'
import { accountRules, trades } from './data/mockData'
import {
  buildEquityCurve,
  calculateAssetPerformance,
  calculatePerformance,
  calculateProfitLossSummary,
  calculateRiskMetrics,
} from './utils/calculations'
import './App.css'

function App() {
  const performance = calculatePerformance(trades, accountRules.startingBalance)
  const risk = calculateRiskMetrics(trades, accountRules)
  const equity = buildEquityCurve(trades, accountRules.startingBalance)
  const assets = calculateAssetPerformance(trades)
  const pnlSummary = calculateProfitLossSummary(trades)
  const statusSlug = risk.status.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="app-shell">
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-orb bg-orb-a" aria-hidden="true" />
      <div className="bg-orb bg-orb-b" aria-hidden="true" />
      <div className="bg-orb bg-orb-c" aria-hidden="true" />

      <div className="app">
        <nav className="topbar" aria-label="Tradescape">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              TS
            </div>
            <div className="brand-text">
              <strong>Tradescape</strong>
              <span>Crypto Prop Firm · Evaluation Desk</span>
            </div>
          </div>
          <div className="topbar-meta">
            <span className="hide-mobile">FIU-Registered</span>
            <span className="live-pill">Live risk view</span>
          </div>
        </nav>

        <header className="app-header">
          <div>
            <p className="eyebrow">Trader Risk Dashboard</p>
            <h1>Know your rules before your next trade</h1>
            <p className="tagline">
              Balance, performance, and rule headroom — so you can see instantly
              if you are safe, approaching a limit, or at risk.
            </p>
          </div>
          <div className={`header-status status-${statusSlug}`}>
            <span className="status-dot" aria-hidden="true" />
            {risk.status}
          </div>
        </header>

        <main className="dashboard">
          <div className="reveal reveal-1">
            <RiskIndicator
              risk={risk}
              maximumDrawdown={accountRules.maximumDrawdown}
              dailyLossLimit={accountRules.dailyLossLimit}
            />
          </div>

          <div className="dashboard-grid equal-panels">
            <div className="reveal reveal-2">
              <AccountSummary rules={accountRules} performance={performance} />
            </div>
            <div className="reveal reveal-3">
              <PerformancePanel stats={performance} />
            </div>
          </div>

          <div className="reveal reveal-4">
            <PnLCharts
              trades={trades}
              summary={pnlSummary}
              performance={performance}
            />
          </div>

          <div className="dashboard-grid">
            <div className="reveal reveal-5">
              <TradeList trades={trades} />
            </div>
            <div className="reveal reveal-5">
              <EquityCurve
                points={equity}
                startingBalance={accountRules.startingBalance}
              />
            </div>
          </div>

          <div className="reveal reveal-5">
            <AssetBreakdown assets={assets} />
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}

export default App
