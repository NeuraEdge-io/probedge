import { NextRequest, NextResponse } from "next/server";
import { ProcessedBet, detectSport, detectBetType } from "@/lib/polymarket";
import { MOCK_BETS } from "@/lib/mockData";

export const runtime = "nodejs";
export const revalidate = 300; // re-scan every 5 min 24/7

async function fetchLive(): Promise<ProcessedBet[]> {
  const GAMMA = "https://gamma-api.polymarket.com";
  const seen = new Set<string>();
  const all: ProcessedBet[] = [];

  // Sports-specific tag endpoints first (most accurate), then broad scan
  const urls = [
    `${GAMMA}/markets?active=true&closed=false&limit=100&tag_slug=mlb`,
    `${GAMMA}/markets?active=true&closed=false&limit=100&tag_slug=nba`,
    `${GAMMA}/markets?active=true&closed=false&limit=100&tag_slug=tennis`,
    `${GAMMA}/markets?active=true&closed=false&limit=100&tag_slug=nfl`,
    `${GAMMA}/markets?active=true&closed=false&limit=100&tag_slug=nhl`,
    `${GAMMA}/markets?active=true&closed=false&limit=100&tag_slug=soccer`,
    `${GAMMA}/markets?active=true&closed=false&limit=100&tag_slug=ufc`,
    `${GAMMA}/markets?active=true&closed=false&limit=100&tag_slug=golf`,
    `${GAMMA}/markets?active=true&closed=false&limit=200`, // broad sweep
  ];

  const sportTerms = /baseball|basketball|football|hockey|tennis|soccer|ufc|mma|golf|home.?run|strikeout|pitcher|wimbledon|world series|nba finals|super bowl|stanley cup|nfl|mlb|nba|nhl/i;

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 300 },
        headers: { "Accept": "application/json", "User-Agent": "ProbEdge/1.0" },
      });
      if (!res.ok) continue;
      const raw = await res.json();
      const markets = Array.isArray(raw) ? raw : (raw.markets ?? []);

      for (const m of markets) {
        if (!m.active || m.closed || m.archived || !m.accepting_orders) continue;
        const q: string = m.question ?? "";

        // For the broad sweep, only keep sports markets
        if (url.endsWith("limit=200") && !sportTerms.test(q)) continue;

        for (const tk of (m.tokens ?? [])) {
          const price: number = tk.price ?? 0;
          // Skip effectively resolved markets and dust
          if (price < 0.02 || price > 0.98) continue;

          const id = `${m.condition_id}-${tk.token_id}`;
          if (seen.has(id)) continue;
          seen.add(id);

          const tags: string[] = m.tags ?? [];
          const prob  = Math.round(price * 1000) / 10; // e.g. 0.723 → 72.3
          const sport = detectSport(q, tags);
          const betType = detectBetType(q);

          // Edge = fair value minus Polymarket price
          // Polymarket charges 2% fee, so fair price = price / 0.98
          const fairProb = (price / 0.98) * 100;
          const edge = Math.round((fairProb - prob) * 10) / 10;

          all.push({
            id, question: q,
            matchup: undefined, line: undefined,
            sport, betType,
            outcome: tk.outcome ?? "Yes",
            probability: prob,
            impliedOdds: price,
            polymarketOdds: price,
            edge,
            isHighProbability: prob >= 70,
            isUnderdog: prob >= 10 && prob <= 40,
            isHighEdge: Math.abs(edge) >= 2,
            endDate: m.end_date_iso ?? "",
            gameTime: m.game_start_time,
            tokenId: tk.token_id,
            marketSlug: m.market_slug ?? "",
            tags,
          });
        }
      }
    } catch { /* continue to next URL */ }
  }
  return all;
}

export async function GET(req: NextRequest) {
  const sp    = new URL(req.url).searchParams;
  const sport = sp.get("sport") ?? "All";
  const tab   = sp.get("tab")   ?? "all";
  const demo  = sp.get("demo")  === "true";

  let bets: ProcessedBet[];
  try {
    bets = demo ? MOCK_BETS : await fetchLive();
    if (!bets.length) bets = MOCK_BETS; // always have data
  } catch {
    bets = MOCK_BETS;
  }

  // Filter sport
  if (sport !== "All") bets = bets.filter(b => b.sport === sport);

  // Filter tab
  if      (tab === "high-probability") bets = bets.filter(b => b.isHighProbability);
  else if (tab === "underdogs")        bets = bets.filter(b => b.isUnderdog);
  else if (tab === "high-edge")        bets = bets.filter(b => b.isHighEdge);

  // Sort: high-prob first → probability desc → edge desc
  bets.sort((a, b) => {
    if (a.isHighProbability !== b.isHighProbability) return a.isHighProbability ? -1 : 1;
    if (Math.abs(b.probability - a.probability) > 0.5) return b.probability - a.probability;
    return b.edge - a.edge;
  });

  const all = bets;
  const stats = {
    total:           all.length,
    highProbability: all.filter(b => b.isHighProbability).length,
    underdogs:       all.filter(b => b.isUnderdog).length,
    highEdge:        all.filter(b => b.isHighEdge).length,
    sports:          Array.from(new Set(all.map(b => b.sport))),
  };

  return NextResponse.json({
    bets, stats,
    updatedAt: new Date().toISOString(),
    source: demo ? "demo" : "polymarket-live",
  });
}
