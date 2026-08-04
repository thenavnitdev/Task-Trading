export interface Trade {
  id: string
  symbol: string
  side: 'Long' | 'Short'
  pnl: number
}

export interface AccountRules {
  startingBalance: number
  maximumDrawdown: number
  dailyLossLimit: number
}

export type RiskStatus = 'Safe' | 'Approaching Limit' | 'At Risk'

export interface PerformanceStats {
  currentBalance: number
  totalPnl: number
  winningTrades: number
  losingTrades: number
  totalTrades: number
  winRate: number
  largestWinningTrade: number | null
  largestLosingTrade: number | null
}

export interface RiskMetrics {
  currentDrawdown: number
  remainingDrawdown: number
  currentDayLoss: number
  remainingDailyLoss: number
  drawdownUtilization: number
  dailyLossUtilization: number
  status: RiskStatus
  limitingFactor: 'drawdown' | 'daily' | 'none'
}

export interface EquityPoint {
  label: string
  balance: number
  peak: number
}

export interface AssetPerformance {
  symbol: string
  trades: number
  wins: number
  losses: number
  totalPnl: number
  winRate: number
}

export interface ProfitLossSummary {
  grossProfit: number
  grossLoss: number
  netPnl: number
  averageWin: number | null
  averageLoss: number | null
  profitFactor: number | null
}
