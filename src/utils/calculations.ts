import type {
  AccountRules,
  AssetPerformance,
  EquityPoint,
  PerformanceStats,
  ProfitLossSummary,
  RiskMetrics,
  RiskStatus,
  Trade,
} from '../types'

/** Utilization thresholds for risk status messaging. */
const APPROACHING_THRESHOLD = 0.5
const AT_RISK_THRESHOLD = 0.8

export function calculatePerformance(
  trades: Trade[],
  startingBalance: number,
): PerformanceStats {
  const totalTrades = trades.length
  const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0)
  const wins = trades.filter((trade) => trade.pnl > 0)
  const losses = trades.filter((trade) => trade.pnl < 0)

  const largestWinningTrade =
    wins.length > 0 ? Math.max(...wins.map((trade) => trade.pnl)) : null
  const largestLosingTrade =
    losses.length > 0 ? Math.min(...losses.map((trade) => trade.pnl)) : null

  return {
    currentBalance: startingBalance + totalPnl,
    totalPnl,
    winningTrades: wins.length,
    losingTrades: losses.length,
    totalTrades,
    winRate: totalTrades === 0 ? 0 : (wins.length / totalTrades) * 100,
    largestWinningTrade,
    largestLosingTrade,
  }
}

/**
 * Builds an equity series from starting balance through each trade.
 * Peak is a running high-water mark used for drawdown.
 */
export function buildEquityCurve(
  trades: Trade[],
  startingBalance: number,
): EquityPoint[] {
  const points: EquityPoint[] = [
    { label: 'Start', balance: startingBalance, peak: startingBalance },
  ]

  let balance = startingBalance
  let peak = startingBalance

  for (const trade of trades) {
    balance += trade.pnl
    peak = Math.max(peak, balance)
    points.push({
      label: `${trade.symbol} ${trade.side}`,
      balance,
      peak,
    })
  }

  return points
}

/**
 * Current drawdown = distance below the high-water mark.
 * Daily loss = decline from day-start equity (here: starting balance,
 * since the mock set is a single trading day).
 */
export function calculateRiskMetrics(
  trades: Trade[],
  rules: AccountRules,
): RiskMetrics {
  const equity = buildEquityCurve(trades, rules.startingBalance)
  const latest = equity[equity.length - 1]
  const currentBalance = latest?.balance ?? rules.startingBalance
  const peak = latest?.peak ?? rules.startingBalance

  const currentDrawdown = Math.max(0, peak - currentBalance)
  const remainingDrawdown = Math.max(0, rules.maximumDrawdown - currentDrawdown)

  const dayStartBalance = rules.startingBalance
  const currentDayLoss = Math.max(0, dayStartBalance - currentBalance)
  const remainingDailyLoss = Math.max(0, rules.dailyLossLimit - currentDayLoss)

  const drawdownUtilization =
    rules.maximumDrawdown === 0 ? 0 : currentDrawdown / rules.maximumDrawdown
  const dailyLossUtilization =
    rules.dailyLossLimit === 0 ? 0 : currentDayLoss / rules.dailyLossLimit

  const worstUtilization = Math.max(drawdownUtilization, dailyLossUtilization)
  const status = getRiskStatus(worstUtilization)

  let limitingFactor: RiskMetrics['limitingFactor'] = 'none'
  if (worstUtilization > 0) {
    limitingFactor =
      drawdownUtilization >= dailyLossUtilization ? 'drawdown' : 'daily'
  }

  return {
    currentDrawdown,
    remainingDrawdown,
    currentDayLoss,
    remainingDailyLoss,
    drawdownUtilization,
    dailyLossUtilization,
    status,
    limitingFactor,
  }
}

export function getRiskStatus(utilization: number): RiskStatus {
  if (utilization >= AT_RISK_THRESHOLD) return 'At Risk'
  if (utilization >= APPROACHING_THRESHOLD) return 'Approaching Limit'
  return 'Safe'
}

/**
 * Groups trades by symbol so the trader can see which assets
 * drive P&L and rule pressure.
 */
export function calculateAssetPerformance(trades: Trade[]): AssetPerformance[] {
  const bySymbol = new Map<string, Trade[]>()

  for (const trade of trades) {
    const existing = bySymbol.get(trade.symbol) ?? []
    existing.push(trade)
    bySymbol.set(trade.symbol, existing)
  }

  return Array.from(bySymbol.entries())
    .map(([symbol, symbolTrades]) => {
      const wins = symbolTrades.filter((trade) => trade.pnl > 0).length
      const losses = symbolTrades.filter((trade) => trade.pnl < 0).length
      const totalPnl = symbolTrades.reduce((sum, trade) => sum + trade.pnl, 0)

      return {
        symbol,
        trades: symbolTrades.length,
        wins,
        losses,
        totalPnl,
        winRate: symbolTrades.length === 0 ? 0 : (wins / symbolTrades.length) * 100,
      }
    })
    .sort((a, b) => b.totalPnl - a.totalPnl)
}

/** Tightest remaining loss allowance — what the trader can still afford to lose. */
export function getRiskBudget(risk: RiskMetrics): number {
  return Math.min(risk.remainingDrawdown, risk.remainingDailyLoss)
}

/** Gross profit / loss totals and averages derived from the trade list. */
export function calculateProfitLossSummary(trades: Trade[]): ProfitLossSummary {
  const wins = trades.filter((trade) => trade.pnl > 0)
  const losses = trades.filter((trade) => trade.pnl < 0)
  const grossProfit = wins.reduce((sum, trade) => sum + trade.pnl, 0)
  const grossLoss = Math.abs(losses.reduce((sum, trade) => sum + trade.pnl, 0))
  const netPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0)

  return {
    grossProfit,
    grossLoss,
    netPnl,
    averageWin: wins.length === 0 ? null : grossProfit / wins.length,
    averageLoss: losses.length === 0 ? null : -(grossLoss / losses.length),
    profitFactor: grossLoss === 0 ? (grossProfit > 0 ? null : 0) : grossProfit / grossLoss,
  }
}
