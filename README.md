# PolyEdge — Daily Best Bets from Polymarket

A sports betting intelligence app that surfaces the best bets daily from Polymarket across all sports — including MLB home run props, hit props, tennis moneylines, NBA/NFL player props, and more. Features an Underdog Spotter and High Probability Plays tab.

## Features

- **All Bets** — Live Polymarket markets across every sport
- **High Probability** — Markets at 70%+ implied probability highlighted in gold
- **Underdog Spotter** — 10–40% probability picks with positive edge
- **High Edge** — Markets where Polymarket price diverges from fair value
- **Prop Coverage**: MLB home runs, hit props, strikeouts; Tennis moneylines; NBA/NFL player props
- **Sport Filters**: MLB, NBA, NFL, NHL, Tennis, Soccer, UFC/MMA, Golf
- **Bet Type Filters**: Home Run, Hit Props, Moneyline, Player Props, Over/Under
- **Row + Card view modes**
- **Live search** across all markets

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Polymarket CLOB API** + **Gamma API**

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** In development, the app uses mock data by default. To use live Polymarket data, remove `mock: "true"` from the API call in `src/app/page.tsx`.

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub + Vercel (Recommended)

1. Push this repo to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: PolyEdge best bets app"
git remote add origin https://github.com/YOUR_USERNAME/polyedge-best-bets.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Leave all settings as default (Next.js auto-detected)
5. Click **Deploy**

Your app will be live at `https://polyedge-best-bets.vercel.app` (or your custom domain).

### Environment Variables (Optional)

No environment variables are required. The Polymarket API is public.

## Switching to Live Data

In `src/app/page.tsx`, find this line:
```ts
mock: "true", // Use mock for now; remove for production
```

Change it to:
```ts
// mock: "true", // comment out or remove
```

And in `src/app/api/bets/route.ts`, the API will automatically fetch from Polymarket in production.

## Polymarket API

This app uses:
- `https://gamma-api.polymarket.com/markets` — Market discovery with tags/filtering
- `https://clob.polymarket.com` — Order book and price data

No API key required for read access.

## Architecture

```
src/
├── app/
│   ├── api/bets/route.ts     # Server-side API route (fetches + processes Polymarket)
│   ├── layout.tsx            # Root layout with fonts/meta
│   └── page.tsx              # Main page (tabs, filters, view modes)
├── components/
│   ├── BetCard.tsx           # BetRow + BetCard display components
│   ├── Navbar.tsx            # Top navigation
│   └── StatsBar.tsx          # Live stats ticker
├── lib/
│   ├── polymarket.ts         # API client + market processing
│   └── mockData.ts           # Development mock data
└── styles/
    └── globals.css           # Global styles + animations
```

## License

MIT
