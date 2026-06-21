// Core types and helpers for Polymarket data

export interface ProcessedBet {
  id: string;
  question: string;       // player name, team, or short title
  matchup?: string;       // "NYY vs BOS"
  line?: string;          // "O 1.5 Hits", "Anytime HR", "ML"
  sport: string;
  betType: string;
  outcome: string;
  probability: number;    // 0–100
  impliedOdds: number;    // 0–1 (raw price from Polymarket)
  polymarketOdds: number;
  edge: number;           // % edge vs fair value
  isHighProbability: boolean;  // prob >= 70%
  isUnderdog: boolean;         // prob 10–40%
  isHighEdge: boolean;         // |edge| >= 2%
  endDate: string;
  gameTime?: string;
  tokenId: string;
  marketSlug: string;
  tags: string[];
}

// Convert Polymarket implied probability (0–1) to American odds string
export function toAmerican(prob: number): string {
  if (prob <= 0 || prob >= 1) return "N/A";
  if (prob >= 0.5) {
    return String(Math.round(-(prob / (1 - prob)) * 100));
  }
  return "+" + String(Math.round(((1 - prob) / prob) * 100));
}

// Detect sport from market question + tags
export function detectSport(q: string, tags: string[]): string {
  const t = (q + " " + tags.join(" ")).toLowerCase();
  if (/\bmlb\b|baseball|home.?run|\bpitcher\b|strikeout|innings|world series|nlcs|alcs/.test(t)) return "MLB";
  if (/\bnba\b|basketball|nba finals|rebounds|assists/.test(t)) return "NBA";
  if (/\bnfl\b|\bfootball\b|touchdown|quarterback|super bowl/.test(t)) return "NFL";
  if (/\bnhl\b|hockey|stanley cup|\bpuck\b/.test(t)) return "NHL";
  if (/tennis|wimbledon|us open|french open|australian open|\batp\b|\bwta\b|grand slam/.test(t)) return "TENNIS";
  if (/\bsoccer\b|premier league|\bmls\b|champions league|bundesliga/.test(t)) return "SOCCER";
  if (/\bufc\b|\bmma\b|\bboxing\b|\bfight\b|knockout|submission/.test(t)) return "UFC_MMA";
  if (/\bgolf\b|\bpga\b|masters|ryder cup/.test(t)) return "GOLF";
  return "Other";
}

export function detectBetType(q: string): string {
  const t = q.toLowerCase();
  if (/home.?run|homerun/.test(t)) return "Home Run";
  if (/\bhit(s)?\b/.test(t) && !/pitcher/.test(t)) return "Hit Props";
  if (/strikeout|\bk prop/.test(t)) return "Strikeout Props";
  if (/\bto win\b|\bwinner\b|moneyline|\bml\b/.test(t)) return "Moneyline";
  if (/\bover\b|\bunder\b|\btotal\b/.test(t)) return "Over/Under";
  if (/points|rebounds|assists|yards|touchdowns|\bgoals\b|saves|blocks/.test(t)) return "Player Props";
  return "Market";
}
