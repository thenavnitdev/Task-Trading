import type { AccountRules, Trade } from '../types'

export const accountRules: AccountRules = {
  startingBalance: 100_000,
  maximumDrawdown: 10_000,
  dailyLossLimit: 5_000,
}

/**
 * Mock trade history for the evaluation account.
 * All trades are treated as occurring on the current trading day
 * so daily-loss risk can be derived from the same dataset.
 */
export const trades: Trade[] = [
  { id: '1', symbol: 'BTC', side: 'Long', pnl: 1_200 },
  { id: '2', symbol: 'ETH', side: 'Short', pnl: -450 },
  { id: '3', symbol: 'BTC', side: 'Short', pnl: 800 },
  { id: '4', symbol: 'SOL', side: 'Long', pnl: -300 },
  { id: '5', symbol: 'ETH', side: 'Long', pnl: 2_000 },
  { id: '6', symbol: 'AVAX', side: 'Long', pnl: 650 },
  { id: '7', symbol: 'XRP', side: 'Short', pnl: -220 },
]
