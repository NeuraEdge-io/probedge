"use client";

import { ProcessedBet } from "@/lib/polymarket";
import { ExternalLink, TrendingUp, Target, Zap, Clock } from "lucide-react";

const SPORT_EMOJI: Record<string, string> = {
  MLB: "⚾",
  NBA: "🏀",
  NFL: "🏈",
  NHL: "🏒",
  TENNIS: "🎾",
  SOCCER: "⚽",
  UFC_MMA: "🥊",
  GOLF: "⛳",
  Other: "🎯",
};

function formatGameTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatGameDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function calcAmerican(prob: number): string {
  const p = prob / 100;
  if (p <= 0 || p >= 1) return "N/A";
  if (p >= 0.5) return String(Math.round(-p / (1 - p) * 100));
  return "+" + String(Math.round((1 - p) / p * 100));
}
function OddsChip({ probability, label }: { probability: number; label?: string }) {
  const american = calcAmerican(probability);
  const isPositive = american.startsWith("+");
  const isFav = probability >= 65;

  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-2 rounded-lg min-w-[72px] cursor-pointer transition-all hover:scale-105"
      style={{
        background: isFav
          ? "linear-gradient(135deg, #1a2a0e 0%, #0d1a06 100%)"
          : "linear-gradient(135deg, #1a1208 0%, #0d0c06 100%)",
        border: isFav
          ? "1px solid rgba(34,197,94,0.35)"
          : "1px solid rgba(212,175,55,0.3)",
      }}
    >
      {label && (
        <span className="text-xs mb-0.5 font-medium" style={{ color: "#9A8F78" }}>
          {label}
        </span>
      )}
      <span
        className="text-lg font-bold font-mono-nums leading-tight"
        style={{ color: isPositive ? "#22C55E" : "#D4AF37" }}
      >
        {american}
      </span>
      <span className="text-xs font-mono-nums" style={{ color: "#9A8F78" }}>
        {probability.toFixed(1)}%
      </span>
    </div>
  );
}

// ─── ROW VIEW (table style like DraftKings/FanDuel) ───
export function BetRow({ bet }: { bet: ProcessedBet }) {
  const sportEmoji = SPORT_EMOJI[bet.sport] || "🎯";
  const american = (bet as any).americanOddsStr || "N/A";
  const isPositive = american.startsWith("+");
  const gameDate = formatGameDate(bet.gameTime);
  const gameTime = formatGameTime(bet.gameTime);

  return (
    <div
      className="group flex items-center gap-0 border-b cursor-pointer hover:bg-white/[0.02] transition-colors"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
      onClick={() => window.open(`https://polymarket.com/event/${bet.marketSlug}`, "_blank")}
    >
      {/* High prob left accent bar */}
      <div
        className="w-0.5 self-stretch shrink-0"
        style={{
          background: bet.isHighProbability
            ? "#D4AF37"
            : bet.isUnderdog
            ? "#EF4444"
            : "transparent",
        }}
      />

      {/* Sport + Game info */}
      <div className="w-44 shrink-0 px-4 py-3 border-r" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-base">{sportEmoji}</span>
          <span className="text-xs font-bold tracking-wider" style={{ color: "#8B7536" }}>
            {bet.sport}
          </span>
        </div>
        <p className="text-xs font-semibold truncate" style={{ color: "#C8BFA8" }}>
          {bet.matchup || "—"}
        </p>
        {(gameDate || gameTime) && (
          <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "#5C5040" }}>
            <Clock size={9} />
            {gameDate} {gameTime}
          </p>
        )}
      </div>

      {/* Player / Market */}
      <div className="flex-1 min-w-0 px-4 py-3 border-r" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 mb-0.5">
          {bet.isHighProbability && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold"
              style={{ background: "rgba(212,175,55,0.12)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.25)" }}>
              <Zap size={8} /> HOT
            </span>
          )}
          {bet.isUnderdog && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold"
              style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>
              <Target size={8} /> DOG
            </span>
          )}
          {bet.isHighEdge && !bet.isHighProbability && !bet.isUnderdog && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold"
              style={{ background: "rgba(34,197,94,0.08)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.2)" }}>
              <TrendingUp size={8} /> EDGE
            </span>
          )}
        </div>
        <p className="text-sm font-bold truncate" style={{ color: "#F5F0E8" }}>
          {bet.question}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: "#9A8F78" }}>
          {bet.outcome}
        </p>
      </div>

      {/* Bet Type */}
      <div className="w-28 shrink-0 px-3 py-3 border-r text-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <span className="text-xs font-medium px-2 py-1 rounded"
          style={{ background: "rgba(255,255,255,0.05)", color: "#9A8F78" }}>
          {bet.betType}
        </span>
        {bet.line && (
          <p className="text-xs font-bold mt-1.5" style={{ color: "#C8BFA8" }}>
            {bet.line}
          </p>
        )}
      </div>

      {/* Odds + Probability */}
      <div className="w-36 shrink-0 px-4 py-3 border-r flex flex-col items-center justify-center gap-0.5"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <span
          className="text-xl font-bold font-mono-nums"
          style={{ color: isPositive ? "#22C55E" : "#D4AF37" }}
        >
          {american}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="h-1 rounded-full overflow-hidden" style={{ width: 48, background: "#1a1a0a" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${bet.probability}%`,
                background: bet.probability >= 70
                  ? "linear-gradient(90deg,#D4AF37,#E8C84A)"
                  : bet.probability >= 50
                  ? "#22C55E"
                  : "#F59E0B",
              }}
            />
          </div>
          <span className="text-xs font-mono-nums font-semibold" style={{ color: "#9A8F78" }}>
            {bet.probability.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Edge */}
      <div className="w-20 shrink-0 px-3 py-3 text-center">
        <span
          className="text-sm font-bold font-mono-nums"
          style={{ color: bet.edge >= 2 ? "#22C55E" : bet.edge >= 1 ? "#F59E0B" : "#9A8F78" }}
        >
          {bet.edge > 0 ? "+" : ""}{bet.edge.toFixed(1)}%
        </span>
        <p className="text-xs mt-0.5" style={{ color: "#5C4D1E" }}>edge</p>
      </div>

      {/* Link icon */}
      <div className="w-8 shrink-0 flex items-center justify-center py-3 opacity-0 group-hover:opacity-60 transition-opacity">
        <ExternalLink size={12} style={{ color: "#D4AF37" }} />
      </div>
    </div>
  );
}

// ─── CARD VIEW (sportsbook ticket style) ───
export function BetCard({ bet }: { bet: ProcessedBet }) {
  const american = (bet as any).americanOddsStr || "N/A";
  const isPositive = american.startsWith("+");
  const sportEmoji = SPORT_EMOJI[bet.sport] || "🎯";
  const gameDate = formatGameDate(bet.gameTime);
  const gameTime = formatGameTime(bet.gameTime);

  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer group transition-all duration-200 hover:translate-y-[-2px]"
      style={{
        background: "#111108",
        border: bet.isHighProbability
          ? "1px solid rgba(212,175,55,0.3)"
          : bet.isUnderdog
          ? "1px solid rgba(239,68,68,0.2)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: bet.isHighProbability
          ? "0 4px 24px rgba(212,175,55,0.08)"
          : "0 2px 8px rgba(0,0,0,0.4)",
      }}
      onClick={() => window.open(`https://polymarket.com/event/${bet.marketSlug}`, "_blank")}
    >
      {/* Top accent bar */}
      <div
        className="h-0.5 w-full"
        style={{
          background: bet.isHighProbability
            ? "linear-gradient(90deg,#D4AF37,#8B7536)"
            : bet.isUnderdog
            ? "linear-gradient(90deg,#EF4444,#7f1d1d)"
            : "linear-gradient(90deg,#2C2C1A,transparent)",
        }}
      />

      {/* Header: sport + matchup */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{sportEmoji}</span>
          <div>
            <p className="text-xs font-bold tracking-wider" style={{ color: "#8B7536" }}>
              {bet.sport} · {bet.betType}
            </p>
            <p className="text-xs font-semibold" style={{ color: "#C8BFA8" }}>
              {bet.matchup}
            </p>
          </div>
        </div>
        {(gameDate || gameTime) && (
          <div className="text-right">
            <p className="text-xs font-bold" style={{ color: "#D4AF37" }}>{gameDate}</p>
            <p className="text-xs" style={{ color: "#5C5040" }}>{gameTime}</p>
          </div>
        )}
      </div>

      {/* Player / market name */}
      <div className="px-4 pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-base font-bold leading-tight" style={{ color: "#F5F0E8" }}>
          {bet.question}
        </p>
        <p className="text-sm mt-0.5" style={{ color: "#9A8F78" }}>{bet.outcome}</p>
      </div>

      {/* Odds section */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs mb-1" style={{ color: "#5C5040" }}>LINE</p>
          <span
            className="text-xs font-bold px-2 py-1 rounded"
            style={{ background: "rgba(255,255,255,0.05)", color: "#C8BFA8" }}
          >
            {bet.line || bet.betType}
          </span>
        </div>

        {/* Main odds display */}
        <div className="text-center">
          <p className="text-xs mb-1" style={{ color: "#5C5040" }}>ODDS</p>
          <span
            className="text-2xl font-bold font-mono-nums"
            style={{ color: isPositive ? "#22C55E" : "#D4AF37" }}
          >
            {american}
          </span>
        </div>

        {/* Probability */}
        <div className="text-right">
          <p className="text-xs mb-1" style={{ color: "#5C5040" }}>PROB</p>
          <span
            className="text-lg font-bold font-mono-nums"
            style={{
              color: bet.probability >= 70 ? "#D4AF37" : bet.probability >= 50 ? "#22C55E" : "#F5F0E8",
            }}
          >
            {bet.probability.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Prob bar */}
      <div className="px-4 pb-3">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "#1a1a0a" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${bet.probability}%`,
              background: bet.probability >= 70
                ? "linear-gradient(90deg,#D4AF37,#E8C84A)"
                : bet.probability >= 50
                ? "#22C55E"
                : "#F59E0B",
            }}
          />
        </div>
      </div>

      {/* Footer: badges + edge */}
      <div
        className="px-4 py-2 flex items-center justify-between border-t"
        style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}
      >
        <div className="flex items-center gap-1.5">
          {bet.isHighProbability && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold"
              style={{ background: "rgba(212,175,55,0.12)", color: "#D4AF37" }}>
              <Zap size={8} /> HIGH PROB
            </span>
          )}
          {bet.isUnderdog && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold"
              style={{ background: "rgba(239,68,68,0.1)", color: "#F87171" }}>
              <Target size={8} /> UNDERDOG
            </span>
          )}
          {bet.isHighEdge && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold"
              style={{ background: "rgba(34,197,94,0.08)", color: "#4ADE80" }}>
              <TrendingUp size={8} /> +EDGE
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-80 transition-opacity">
          <span className="text-xs" style={{ color: "#8B7536" }}>Polymarket</span>
          <ExternalLink size={10} style={{ color: "#8B7536" }} />
        </div>
      </div>
    </div>
  );
}
