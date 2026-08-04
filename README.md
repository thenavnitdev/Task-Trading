# Tradescape — Trader Risk Dashboard

A simple React dashboard that helps an evaluation trader answer one question quickly:

**Am I currently in danger of violating my account rules?**

Live demo and GitHub links (fill in after you publish):
- **Live:** _(Vercel/Netlify URL)_
- **Repo:** _(GitHub URL)_

## How to run

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build
npm run preview  # preview the production build
```

## Submit (GitHub + live URL)

### 1. Push to GitHub
Create an empty GitHub repo, then from this folder:

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

### 2. Deploy (Vercel — recommended)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repo
3. Framework preset: **Vite** (defaults are fine)
4. Deploy → copy the live URL into this README

Or with the Vercel CLI (after `npx vercel login`):

```bash
npm run build
npx vercel --prod
```

## What I built

### Account
- Starting balance, current balance, maximum drawdown, daily loss limit
- Current balance is **derived**: `starting balance + sum(trade P&L)`

### Trading performance (all derived from trade data)
- Total P&L
- Winning / losing trades
- Win rate
- Largest winning trade
- Largest losing trade

### Rule risk indicator
Shows:
- Current drawdown & remaining drawdown
- Current day’s loss & remaining daily loss limit
- A clear status: **Safe** / **Approaching Limit** / **At Risk**
- A **remaining risk budget** (the tighter of remaining drawdown vs remaining daily loss)

Status thresholds (based on the worse of drawdown % used and daily-loss % used):
| Status | Utilization |
|---|---|
| Safe | &lt; 50% |
| Approaching Limit | 50–80% |
| At Risk | ≥ 80% |

**How drawdown is calculated here:** equity is walked trade-by-trade from the starting balance. Drawdown is the distance below the running peak (high-water mark). Daily loss is the decline from day-start equity (this mock dataset is treated as one trading day).

### Mock data

| Trade | P&L |
|---|---|
| BTC Long | +$1,200 |
| ETH Short | −$450 |
| BTC Short | +$800 |
| SOL Long | −$300 |
| ETH Long | +$2,000 |
| AVAX Long | +$650 |
| XRP Short | −$220 |

Account rules:
- Starting balance: `$100,000`
- Maximum drawdown: `$10,000`
- Daily loss limit: `$5,000`

## Additional feature

**Equity curve + performance by asset**

I added a trade-by-trade equity curve and a per-asset P&L breakdown.

**Why:** Numbers alone don’t show *how* the account got there. The equity curve makes the path (and peak) visible, which is the basis for drawdown. The asset table answers a practical follow-up: “Which markets are helping me stay safe vs adding pressure?” That helps a trader decide what to trade next without digging through the full ticket list.

## Project structure

```
src/
  components/     # Reusable UI pieces (metrics, risk, trades, equity, assets)
  data/           # Mock account rules + trades
  types/          # Shared TypeScript types
  utils/          # Pure calculation + formatting helpers
  App.tsx         # Dashboard composition
```

Calculations live in `src/utils/calculations.ts` so UI components stay presentational and values are never hardcoded.

## Edge cases handled
- Empty trade list (win rate / largest win-loss / charts)
- Division-by-zero for win rate and utilization
- Remaining limits floored at zero
- Responsive layout for mobile and desktop

## Product questions

### 1. What is drawdown in trading?
Drawdown is how far the account has fallen from its peak equity (high-water mark). If the account peaked at `$103,250` and later sits at `$101,000`, the current drawdown is `$2,250`. Evaluation accounts usually enforce a **maximum drawdown** — if you fall that far from peak (or from a defined reference), the account fails.

### 2. Why would a trader care about remaining drawdown rather than just current P&L?
P&L says whether you are up or down. Remaining drawdown says **how much more you are allowed to lose before the account is breached**. A trader can be net profitable overall and still be close to failing if they gave back a large chunk from peak. Remaining drawdown is the real “oxygen left” under the rule set.

### 3. If I had another day, what would I improve?
- Separate multi-day trade history so daily loss is based on true day-start equity, not the whole mock set
- Intraday open-position risk (unrealized P&L against the same limits)
- Alerts / what-if sizing: “If I risk X on the next trade, what does my status become?”
- Persist trades and rules via a small API instead of mock data

## Tech
- React 19 + TypeScript + Vite
- No backend, auth, or live trading API (as allowed by the brief)

## Contact
Assignment for Tradescape — Aniket Mittal (`mittalaniket07@gmail.com`)
