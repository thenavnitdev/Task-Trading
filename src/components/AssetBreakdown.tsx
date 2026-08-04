import type { AssetPerformance } from '../types'
import { formatCurrency, formatPercent, pnlClass } from '../utils/format'

interface AssetBreakdownProps {
  assets: AssetPerformance[]
}

/**
 * Companion view for the equity curve: which assets are helping or
 * hurting the evaluation account.
 */
export function AssetBreakdown({ assets }: AssetBreakdownProps) {
  return (
    <section className="panel" aria-labelledby="assets-heading">
      <div className="panel-header">
        <h2 id="assets-heading">Performance by asset</h2>
        <p>Where edge — and risk — is concentrated</p>
      </div>

      {assets.length === 0 ? (
        <p className="empty-state">No asset data yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Asset</th>
                <th scope="col">Trades</th>
                <th scope="col">Win rate</th>
                <th scope="col">P&L</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.symbol}>
                  <td>
                    <span className="trade-symbol">{asset.symbol}</span>
                  </td>
                  <td>
                    {asset.trades}
                    <span className="muted">
                      {' '}
                      ({asset.wins}W / {asset.losses}L)
                    </span>
                  </td>
                  <td>{formatPercent(asset.winRate)}</td>
                  <td className={pnlClass(asset.totalPnl)}>
                    {formatCurrency(asset.totalPnl, { signed: true })}
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
