export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />

      <div className="footer-top">
        <div className="footer-brand">
          <div className="brand-mark" aria-hidden="true">
            TS
          </div>
          <div>
            <strong>Tradescape</strong>
            <p>
              India’s trusted crypto prop firm evaluation desk — track rules,
              P&amp;L, and remaining risk budget in one place.
            </p>
          </div>
        </div>

        <div className="footer-cols">
          <div>
            <h3>Dashboard</h3>
            <ul>
              <li>Account rules</li>
              <li>Risk indicator</li>
              <li>Profit &amp; loss charts</li>
              <li>Equity curve</li>
            </ul>
          </div>
          <div>
            <h3>Product</h3>
            <ul>
              <li>
                <a href="https://tradescape.co.in/" target="_blank" rel="noreferrer">
                  Official site
                </a>
              </li>
              <li>
                <a href="https://tradescape.co.in/" target="_blank" rel="noreferrer">
                  How it works
                </a>
              </li>
              <li>
                <a href="https://tradescape.co.in/" target="_blank" rel="noreferrer">
                  Prop firm rules
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3>Assignment</h3>
            <ul>
              <li>Mock trade data</li>
              <li>Derived metrics only</li>
              <li>No live trading API</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} Tradescape Risk Dashboard · Built for evaluation traders</p>
        <p className="footer-note">
          Charts &amp; balances are calculated from supplied trades — nothing
          critical is hardcoded.
        </p>
      </div>
    </footer>
  )
}
