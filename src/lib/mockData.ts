import { ProcessedBet } from "./polymarket";

// Accurate mock data in real sportsbook format
// Used as fallback when Polymarket API returns no results
export const MOCK_BETS: ProcessedBet[] = [
  // ── MLB HOME RUN PROPS ──────────────────────────────────────────────────
  {
    id:"hr-judge-1", question:"Aaron Judge", matchup:"NYY vs CIN", line:"Anytime HR",
    sport:"MLB", betType:"Home Run", outcome:"To Hit a Home Run",
    probability:31.4, impliedOdds:0.314, polymarketOdds:0.314, edge:4.2,
    isHighProbability:false, isUnderdog:true, isHighEdge:true,
    endDate:"2026-06-20T23:59Z", gameTime:"2026-06-20T17:35Z",
    tokenId:"m1", marketSlug:"judge-hr-cin", tags:["mlb","home-run"],
  },
  {
    id:"hr-ohtani-1", question:"Shohei Ohtani", matchup:"LAD vs BAL", line:"Anytime HR",
    sport:"MLB", betType:"Home Run", outcome:"To Hit a Home Run",
    probability:28.7, impliedOdds:0.287, polymarketOdds:0.287, edge:3.6,
    isHighProbability:false, isUnderdog:true, isHighEdge:true,
    endDate:"2026-06-20T23:59Z", gameTime:"2026-06-21T02:10Z",
    tokenId:"m2", marketSlug:"ohtani-hr-bal", tags:["mlb","home-run"],
  },
  {
    id:"hr-alvarez-1", question:"Yordan Alvarez", matchup:"HOU vs CLE", line:"Anytime HR",
    sport:"MLB", betType:"Home Run", outcome:"To Hit a Home Run",
    probability:26.2, impliedOdds:0.262, polymarketOdds:0.262, edge:3.9,
    isHighProbability:false, isUnderdog:true, isHighEdge:true,
    endDate:"2026-06-20T23:59Z", gameTime:"2026-06-21T00:10Z",
    tokenId:"m3", marketSlug:"alvarez-hr-cle", tags:["mlb","home-run"],
  },
  {
    id:"hr-vlad-1", question:"Vladimir Guerrero Jr.", matchup:"TOR vs CHC", line:"Anytime HR",
    sport:"MLB", betType:"Home Run", outcome:"To Hit a Home Run",
    probability:24.8, impliedOdds:0.248, polymarketOdds:0.248, edge:2.1,
    isHighProbability:false, isUnderdog:true, isHighEdge:true,
    endDate:"2026-06-20T23:59Z", gameTime:"2026-06-20T19:20Z",
    tokenId:"m3b", marketSlug:"vlad-hr-chc", tags:["mlb","home-run"],
  },

  // ── MLB HIT PROPS ────────────────────────────────────────────────────────
  {
    id:"hit-freeman-1", question:"Freddie Freeman", matchup:"LAD vs BAL", line:"O 1.5 Hits",
    sport:"MLB", betType:"Hit Props", outcome:"Over 1.5 Hits",
    probability:72.3, impliedOdds:0.723, polymarketOdds:0.723, edge:1.5,
    isHighProbability:true, isUnderdog:false, isHighEdge:false,
    endDate:"2026-06-20T23:59Z", gameTime:"2026-06-21T02:10Z",
    tokenId:"m4", marketSlug:"freeman-hits-bal", tags:["mlb","hits"],
  },
  {
    id:"hit-soto-1", question:"Juan Soto", matchup:"NYM vs PHI", line:"O 0.5 Hits",
    sport:"MLB", betType:"Hit Props", outcome:"Over 0.5 Hits",
    probability:81.6, impliedOdds:0.816, polymarketOdds:0.816, edge:1.7,
    isHighProbability:true, isUnderdog:false, isHighEdge:false,
    endDate:"2026-06-20T23:59Z", gameTime:"2026-06-20T23:15Z",
    tokenId:"m5", marketSlug:"soto-hits-phi", tags:["mlb","hits"],
  },
  {
    id:"hit-betts-1", question:"Mookie Betts", matchup:"LAD vs BAL", line:"O 1.5 Hits",
    sport:"MLB", betType:"Hit Props", outcome:"Over 1.5 Hits",
    probability:67.4, impliedOdds:0.674, polymarketOdds:0.674, edge:2.4,
    isHighProbability:false, isUnderdog:false, isHighEdge:true,
    endDate:"2026-06-20T23:59Z", gameTime:"2026-06-21T02:10Z",
    tokenId:"m5b", marketSlug:"betts-hits-bal", tags:["mlb","hits"],
  },

  // ── MLB STRIKEOUT PROPS ──────────────────────────────────────────────────
  {
    id:"k-skenes-1", question:"Paul Skenes", matchup:"PIT vs COL", line:"O 7.5 Ks",
    sport:"MLB", betType:"Strikeout Props", outcome:"Over 7.5 Strikeouts",
    probability:58.3, impliedOdds:0.583, polymarketOdds:0.583, edge:3.1,
    isHighProbability:false, isUnderdog:false, isHighEdge:true,
    endDate:"2026-06-20T23:59Z", gameTime:"2026-06-21T03:10Z",
    tokenId:"m6", marketSlug:"skenes-ks-col", tags:["mlb","strikeouts"],
  },
  {
    id:"k-yamamoto-1", question:"Yoshinobu Yamamoto", matchup:"LAD vs BAL", line:"O 6.5 Ks",
    sport:"MLB", betType:"Strikeout Props", outcome:"Over 6.5 Strikeouts",
    probability:62.1, impliedOdds:0.621, polymarketOdds:0.621, edge:2.8,
    isHighProbability:false, isUnderdog:false, isHighEdge:true,
    endDate:"2026-06-20T23:59Z", gameTime:"2026-06-21T02:10Z",
    tokenId:"m6b", marketSlug:"yamamoto-ks-bal", tags:["mlb","strikeouts"],
  },

  // ── MLB MONEYLINES (including underdogs) ─────────────────────────────────
  {
    id:"ml-cws-1", question:"Chicago White Sox", matchup:"CWS vs DET", line:"ML",
    sport:"MLB", betType:"Moneyline", outcome:"Game Winner",
    probability:34.2, impliedOdds:0.342, polymarketOdds:0.342, edge:2.8,
    isHighProbability:false, isUnderdog:true, isHighEdge:true,
    endDate:"2026-06-20T23:59Z", gameTime:"2026-06-20T17:10Z",
    tokenId:"m7", marketSlug:"cws-ml-det", tags:["mlb","moneyline"],
  },
  {
    id:"ml-pit-1", question:"Pittsburgh Pirates", matchup:"PIT vs COL", line:"ML",
    sport:"MLB", betType:"Moneyline", outcome:"Game Winner",
    probability:42.1, impliedOdds:0.421, polymarketOdds:0.421, edge:1.9,
    isHighProbability:false, isUnderdog:false, isHighEdge:false,
    endDate:"2026-06-20T23:59Z", gameTime:"2026-06-21T03:10Z",
    tokenId:"m7b", marketSlug:"pit-ml-col", tags:["mlb","moneyline"],
  },

  // ── TENNIS MONEYLINES ────────────────────────────────────────────────────
  {
    id:"ten-alcaraz-1", question:"Carlos Alcaraz", matchup:"Alcaraz vs Monfils · Wimbledon R3", line:"ML",
    sport:"TENNIS", betType:"Moneyline", outcome:"Match Winner",
    probability:88.4, impliedOdds:0.884, polymarketOdds:0.884, edge:1.8,
    isHighProbability:true, isUnderdog:false, isHighEdge:false,
    endDate:"2026-06-21T18:00Z", gameTime:"2026-06-21T13:00Z",
    tokenId:"m8", marketSlug:"alcaraz-wimbledon-r3", tags:["tennis","wimbledon"],
  },
  {
    id:"ten-swiatek-1", question:"Iga Swiatek", matchup:"Swiatek vs Paolini · Wimbledon R3", line:"ML",
    sport:"TENNIS", betType:"Moneyline", outcome:"Match Winner",
    probability:73.6, impliedOdds:0.736, polymarketOdds:0.736, edge:2.2,
    isHighProbability:true, isUnderdog:false, isHighEdge:true,
    endDate:"2026-06-21T18:00Z", gameTime:"2026-06-21T11:00Z",
    tokenId:"m9", marketSlug:"swiatek-wimbledon-r3", tags:["tennis","wimbledon"],
  },
  {
    id:"ten-cobolli-1", question:"Flavio Cobolli", matchup:"Cobolli vs Sinner · Wimbledon R3", line:"ML +Upset",
    sport:"TENNIS", betType:"Moneyline", outcome:"Match Winner (Upset)",
    probability:19.2, impliedOdds:0.192, polymarketOdds:0.192, edge:5.3,
    isHighProbability:false, isUnderdog:true, isHighEdge:true,
    endDate:"2026-06-21T18:00Z", gameTime:"2026-06-21T14:00Z",
    tokenId:"m10", marketSlug:"cobolli-sinner-wimbledon", tags:["tennis","wimbledon","upset"],
  },
  {
    id:"ten-kec-1", question:"Miomir Kecmanovic", matchup:"Kecmanovic vs Djokovic · Wimbledon R3", line:"ML +Upset",
    sport:"TENNIS", betType:"Moneyline", outcome:"Match Winner (Upset)",
    probability:21.8, impliedOdds:0.218, polymarketOdds:0.218, edge:4.9,
    isHighProbability:false, isUnderdog:true, isHighEdge:true,
    endDate:"2026-06-21T18:00Z", gameTime:"2026-06-21T12:00Z",
    tokenId:"m11", marketSlug:"kec-djokovic-wimbledon", tags:["tennis","wimbledon","upset"],
  },

  // ── NBA PLAYER PROPS ─────────────────────────────────────────────────────
  {
    id:"nba-jokic-1", question:"Nikola Jokic", matchup:"DEN vs OKC · NBA Finals Gm5", line:"O 24.5 PTS",
    sport:"NBA", betType:"Player Props", outcome:"Over 24.5 Points",
    probability:63.8, impliedOdds:0.638, polymarketOdds:0.638, edge:2.6,
    isHighProbability:false, isUnderdog:false, isHighEdge:true,
    endDate:"2026-06-20T03:00Z", gameTime:"2026-06-20T01:00Z",
    tokenId:"m12", marketSlug:"jokic-pts-nba-g5", tags:["nba","player-props"],
  },
  {
    id:"nba-sga-1", question:"Shai Gilgeous-Alexander", matchup:"OKC vs DEN · NBA Finals Gm5", line:"O 29.5 PTS",
    sport:"NBA", betType:"Player Props", outcome:"Over 29.5 Points",
    probability:57.4, impliedOdds:0.574, polymarketOdds:0.574, edge:3.2,
    isHighProbability:false, isUnderdog:false, isHighEdge:true,
    endDate:"2026-06-20T03:00Z", gameTime:"2026-06-20T01:00Z",
    tokenId:"m13", marketSlug:"sga-pts-nba-g5", tags:["nba","player-props"],
  },

  // ── OVER/UNDER ───────────────────────────────────────────────────────────
  {
    id:"ou-pitcol-1", question:"PIT vs COL — Total Runs", matchup:"PIT vs COL", line:"O 9.5",
    sport:"MLB", betType:"Over/Under", outcome:"Over 9.5 Runs",
    probability:76.4, impliedOdds:0.764, polymarketOdds:0.764, edge:1.2,
    isHighProbability:true, isUnderdog:false, isHighEdge:false,
    endDate:"2026-06-20T23:59Z", gameTime:"2026-06-21T03:10Z",
    tokenId:"m14", marketSlug:"pit-col-total", tags:["mlb","over-under"],
  },
  {
    id:"ou-wim-1", question:"Wimbledon Men's Final — Total Sets", matchup:"Wimbledon Final", line:"O 3.5 Sets",
    sport:"TENNIS", betType:"Game Props", outcome:"Over 3.5 Sets",
    probability:74.8, impliedOdds:0.748, polymarketOdds:0.748, edge:1.9,
    isHighProbability:true, isUnderdog:false, isHighEdge:false,
    endDate:"2026-07-14T18:00Z", tokenId:"m15",
    marketSlug:"wimbledon-final-sets", tags:["tennis","wimbledon"],
  },
];
