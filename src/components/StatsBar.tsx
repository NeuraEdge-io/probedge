"use client";
import { Activity, Zap, Target, TrendingUp } from "lucide-react";

interface Props {
  stats: { total:number; highProbability:number; underdogs:number; highEdge:number; sports:string[] };
  lastUpdated: string;
}

export function StatsBar({ stats, lastUpdated }: Props) {
  const t = lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "";
  return (
    <div className="flex items-center gap-4 px-6 py-2 border-b overflow-x-auto"
      style={{ borderColor:"#111108", background:"#030300" }}>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background:"#22C55E", boxShadow:"0 0 5px #22C55E" }}/>
        <Activity size={12} style={{ color:"#22C55E" }}/>
        <span className="text-xs font-bold" style={{ color:"#22C55E" }}>LIVE</span>
      </div>
      <div className="w-px h-4" style={{ background:"#111108" }}/>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-sm font-bold font-mono-nums" style={{ color:"#F5F0E8" }}>{stats.total}</span>
        <span className="text-xs" style={{ color:"#9A8F78" }}>markets</span>
      </div>
      <div className="w-px h-4" style={{ background:"#111108" }}/>
      <div className="flex items-center gap-1.5 shrink-0">
        <Zap size={11} style={{ color:"#D4AF37" }}/>
        <span className="text-sm font-bold font-mono-nums" style={{ color:"#D4AF37" }}>{stats.highProbability}</span>
        <span className="text-xs" style={{ color:"#9A8F78" }}>high prob</span>
      </div>
      <div className="w-px h-4" style={{ background:"#111108" }}/>
      <div className="flex items-center gap-1.5 shrink-0">
        <Target size={11} style={{ color:"#F87171" }}/>
        <span className="text-sm font-bold font-mono-nums" style={{ color:"#F87171" }}>{stats.underdogs}</span>
        <span className="text-xs" style={{ color:"#9A8F78" }}>underdogs</span>
      </div>
      <div className="w-px h-4" style={{ background:"#111108" }}/>
      <div className="flex items-center gap-1.5 shrink-0">
        <TrendingUp size={11} style={{ color:"#22C55E" }}/>
        <span className="text-sm font-bold font-mono-nums" style={{ color:"#22C55E" }}>{stats.highEdge}</span>
        <span className="text-xs" style={{ color:"#9A8F78" }}>high edge</span>
      </div>
      <div className="flex-1"/>
      {t && <span className="text-xs shrink-0" style={{ color:"#3C3018" }}>Updated {t}</span>}
    </div>
  );
}
