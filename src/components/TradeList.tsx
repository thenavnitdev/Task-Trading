import type { Trade } from '../types'
import { formatCurrency, pnlClass } from '../utils/format'

interface TradeListProps {
  trades: Trade[]
}

export function TradeList({ trades }: TradeListProps) {
  return (
    <section className="panel" aria-labelledby="trades-heading">
      <div className="panel-header">
        <h2 id="trades-heading">Trades</h2>
        <p>{trades.length === 0 ? 'No trades yet' : `${trades.length} closed trades`}</p>
      </div>

      {trades.length === 0 ? (
        <p className="empty-state">Trade P&L will appear here once activity starts.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Trade</th>
                <th scope="col">Side</th>
                <th scope="col">P&L</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id}>
                  <td>
                    <span className="trade-symbol">{trade.symbol}</span>
                  </td>
                  <td>{trade.side}</td>
                  <td className={pnlClass(trade.pnl)}>
                    {formatCurrency(trade.pnl, { signed: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
