"use client";
import { useState, useEffect, useCallback } from "react";
import { ProcessedBet, toAmerican } from "@/lib/polymarket";
import { Navbar } from "@/components/Navbar";
import { StatsBar } from "@/components/StatsBar";
import { LayoutGrid, LayoutList, Zap, Target, TrendingUp, Trophy, Search, ExternalLink } from "lucide-react";

type Tab = "all"|"high-probability"|"underdogs"|"high-edge";
type View = "row"|"card";

const SPORTS=["All","MLB","NBA","NFL","NHL","TENNIS","SOCCER","UFC_MMA","GOLF"];
const SPORT_LABEL:Record<string,string>={All:"All Sports",MLB:"⚾ MLB",NBA:"🏀 NBA",NFL:"🏈 NFL",NHL:"🏒 NHL",TENNIS:"🎾 Tennis",SOCCER:"⚽ Soccer",UFC_MMA:"🥊 UFC/MMA",GOLF:"⛳ Golf"};
const TYPES=["All Types","Home Run","Hit Props","Strikeout Props","Moneyline","Player Props","Over/Under","Game Props","Market"];

const TABS:[Tab,string,React.ReactNode,string][]=[
  ["all",          "All Bets",         <Trophy size={13}/>,    "#F5F0E8"],
  ["high-probability","High Probability",<Zap size={13}/>,   "#D4AF37"],
  ["underdogs",    "Underdogs",        <Target size={13}/>,   "#F87171"],
  ["high-edge",    "High Edge",        <TrendingUp size={13}/>,"#22C55E"],
];

const SPORT_EMOJI:Record<string,string>={MLB:"⚾",NBA:"🏀",NFL:"🏈",NHL:"🏒",TENNIS:"🎾",SOCCER:"⚽",UFC_MMA:"🥊",GOLF:"⛳",Other:"🎯"};
const TEAM_COLOR:Record<string,string>={
  NYY:"#003087",NYM:"#002D72",BOS:"#BD3039",LAD:"#005A9C",SF:"#FD5A1E",CHC:"#0E3386",
  CWS:"#27251F",ATL:"#CE1141",MIA:"#00A3E0",PHI:"#E81828",WSH:"#AB0003",PIT:"#FDB827",
  CIN:"#C6011F",MIL:"#B6922E",STL:"#C41E3A",MIN:"#002B5C",DET:"#0C2C56",CLE:"#E31937",
  KC:"#004687",HOU:"#002D62",TEX:"#003278",ATH:"#003831",OAK:"#003831",SEA:"#0C2C56",
  LAA:"#BA0021",COL:"#33006F",ARI:"#A71930",SD:"#2F241D",TB:"#092C5C",BAL:"#DF4601",TOR:"#134A8E",
};

function probColor(p:number){
  if(p>=70)return"#D4AF37";
  if(p>=55)return"#22C55E";
  if(p>=40)return"#F5F0E8";
  if(p>=25)return"#F59E0B";
  return"#F87171";
}

function ProbBar({p}:{p:number}){
  return(
    <div className="flex items-center gap-1.5">
      <div className="h-1 rounded-full overflow-hidden" style={{width:44,background:"#111108"}}>
        <div className="h-full rounded-full" style={{width:`${Math.min(p,100)}%`,background:probColor(p)}}/>
      </div>
      <span className="text-xs font-bold font-mono-nums" style={{color:probColor(p)}}>{p.toFixed(1)}%</span>
    </div>
  );
}

function BadgeHP(){return<span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold" style={{background:"rgba(212,175,55,0.12)",color:"#D4AF37",border:"1px solid rgba(212,175,55,0.25)"}}><Zap size={8}/>HOT</span>;}
function BadgeUD(){return<span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold" style={{background:"rgba(239,68,68,0.10)",color:"#F87171",border:"1px solid rgba(239,68,68,0.2)"}}><Target size={8}/>DOG</span>;}
function BadgeE(){return<span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold" style={{background:"rgba(34,197,94,0.08)",color:"#4ADE80",border:"1px solid rgba(34,197,94,0.18)"}}><TrendingUp size={8}/>EDGE</span>;}

function BetRow({bet}:{bet:ProcessedBet}){
  const american=toAmerican(bet.impliedOdds);
  const pos=american.startsWith("+");
  const gameDate=bet.gameTime?new Date(bet.gameTime).toLocaleDateString("en-US",{month:"short",day:"numeric"}):"";
  const gameTime=bet.gameTime?new Date(bet.gameTime).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true}):"";

  return(
    <div className="group flex items-stretch border-b cursor-pointer hover:bg-white/[0.018] transition-colors"
      style={{borderColor:"rgba(255,255,255,0.05)"}}
      onClick={()=>window.open(`https://polymarket.com/event/${bet.marketSlug}`,"_blank")}>

      {/* accent bar */}
      <div className="w-0.5 shrink-0" style={{background:bet.isHighProbability?"#D4AF37":bet.isUnderdog?"#EF4444":"transparent"}}/>

      {/* Game/Sport */}
      <div className="w-40 shrink-0 px-3 py-3 border-r flex flex-col justify-center gap-1"
        style={{borderColor:"rgba(255,255,255,0.05)"}}>
        <div className="flex items-center gap-1.5">
          <span className="text-base">{SPORT_EMOJI[bet.sport]||"🎯"}</span>
          <span className="text-xs font-bold" style={{color:"#8B7536"}}>{bet.sport}</span>
        </div>
        {bet.matchup&&<p className="text-xs font-semibold truncate" style={{color:"#C8BFA8"}}>{bet.matchup}</p>}
        {(gameDate||gameTime)&&(
          <p className="text-xs" style={{color:"#3C3018"}}>{gameDate} {gameTime}</p>
        )}
      </div>

      {/* Market / Player */}
      <div className="flex-1 min-w-0 px-4 py-3 border-r flex flex-col justify-center"
        style={{borderColor:"rgba(255,255,255,0.05)"}}>
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          {bet.isHighProbability&&<BadgeHP/>}
          {bet.isUnderdog&&<BadgeUD/>}
          {bet.isHighEdge&&!bet.isHighProbability&&!bet.isUnderdog&&<BadgeE/>}
        </div>
        <p className="text-sm font-bold truncate" style={{color:"#F5F0E8"}}>{bet.question}</p>
        <p className="text-xs truncate mt-0.5" style={{color:"#9A8F78"}}>{bet.outcome}</p>
      </div>

      {/* Bet type + line */}
      <div className="w-32 shrink-0 px-3 py-3 border-r flex flex-col items-center justify-center gap-1"
        style={{borderColor:"rgba(255,255,255,0.05)"}}>
        <span className="text-xs px-2 py-0.5 rounded" style={{background:"rgba(255,255,255,0.05)",color:"#9A8F78"}}>{bet.betType}</span>
        {bet.line&&<p className="text-xs font-bold" style={{color:"#C8BFA8"}}>{bet.line}</p>}
      </div>

      {/* Odds */}
      <div className="w-28 shrink-0 px-4 py-3 border-r flex flex-col items-center justify-center gap-1"
        style={{borderColor:"rgba(255,255,255,0.05)"}}>
        <span className="text-xl font-bold font-mono-nums" style={{color:pos?"#22C55E":"#D4AF37"}}>{american}</span>
        <ProbBar p={bet.probability}/>
      </div>

      {/* Edge */}
      <div className="w-20 shrink-0 px-3 py-3 flex flex-col items-center justify-center">
        <span className="text-sm font-bold font-mono-nums"
          style={{color:bet.edge>=2?"#22C55E":bet.edge>=1?"#F59E0B":"#9A8F78"}}>
          {bet.edge>0?"+":""}{bet.edge.toFixed(1)}%
        </span>
        <span className="text-xs mt-0.5" style={{color:"#3C3018"}}>edge</span>
      </div>

      <div className="w-7 shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity">
        <ExternalLink size={11} style={{color:"#D4AF37"}}/>
      </div>
    </div>
  );
}

function BetCard({bet}:{bet:ProcessedBet}){
  const american=toAmerican(bet.impliedOdds);
  const pos=american.startsWith("+");
  const gameDate=bet.gameTime?new Date(bet.gameTime).toLocaleDateString("en-US",{month:"short",day:"numeric"}):"";
  const gameTime=bet.gameTime?new Date(bet.gameTime).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true}):"";

  return(
    <div className="rounded-xl overflow-hidden cursor-pointer group hover:-translate-y-0.5 transition-transform"
      style={{background:"#0a0a04",border:bet.isHighProbability?"1px solid rgba(212,175,55,0.3)":bet.isUnderdog?"1px solid rgba(239,68,68,0.18)":"1px solid rgba(255,255,255,0.07)",boxShadow:bet.isHighProbability?"0 4px 20px rgba(212,175,55,0.07)":"none"}}
      onClick={()=>window.open(`https://polymarket.com/event/${bet.marketSlug}`,"_blank")}>

      <div className="h-0.5" style={{background:bet.isHighProbability?"linear-gradient(90deg,#D4AF37,#8B7536)":bet.isUnderdog?"linear-gradient(90deg,#EF4444,#7f1d1d)":"linear-gradient(90deg,#1a1a08,transparent)"}}/>

      <div className="p-4">
        {/* Sport + type */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">{SPORT_EMOJI[bet.sport]||"🎯"}</span>
            <span className="text-xs font-bold" style={{color:"#8B7536"}}>{bet.sport}</span>
            <span className="text-xs px-1.5 py-0.5 rounded" style={{background:"rgba(255,255,255,0.05)",color:"#9A8F78"}}>{bet.betType}</span>
          </div>
          {(gameDate||gameTime)&&<p className="text-xs" style={{color:"#D4AF37"}}>{gameDate} {gameTime}</p>}
        </div>

        {/* Matchup */}
        {bet.matchup&&<p className="text-xs font-semibold mb-1" style={{color:"#C8BFA8"}}>{bet.matchup}</p>}

        {/* Player/Market */}
        <p className="text-base font-bold mb-0.5" style={{color:"#F5F0E8"}}>{bet.question}</p>
        <p className="text-sm mb-3" style={{color:"#9A8F78"}}>{bet.outcome}</p>
        {bet.line&&<p className="text-xs font-bold mb-3" style={{color:"#8B7536"}}>{bet.line}</p>}

        <div className="border-t pt-3" style={{borderColor:"rgba(255,255,255,0.06)"}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs mb-1" style={{color:"#3C3018"}}>ODDS</p>
              <p className="text-2xl font-bold font-mono-nums" style={{color:pos?"#22C55E":"#D4AF37"}}>{american}</p>
            </div>
            <div className="text-right">
              <p className="text-xs mb-1" style={{color:"#3C3018"}}>PROBABILITY</p>
              <p className="text-2xl font-bold font-mono-nums" style={{color:probColor(bet.probability)}}>{bet.probability.toFixed(1)}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs mb-1" style={{color:"#3C3018"}}>EDGE</p>
              <p className="text-lg font-bold font-mono-nums" style={{color:bet.edge>=2?"#22C55E":bet.edge>=1?"#F59E0B":"#9A8F78"}}>
                {bet.edge>0?"+":""}{bet.edge.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="mt-2">
            <div className="h-1.5 rounded-full overflow-hidden" style={{background:"#111108"}}>
              <div className="h-full rounded-full" style={{width:`${Math.min(bet.probability,100)}%`,background:probColor(bet.probability)}}/>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            {bet.isHighProbability&&<BadgeHP/>}
            {bet.isUnderdog&&<BadgeUD/>}
            {bet.isHighEdge&&<BadgeE/>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage(){
  const[bets,setBets]=useState<ProcessedBet[]>([]);
  const[stats,setStats]=useState({total:0,highProbability:0,underdogs:0,highEdge:0,sports:[] as string[]});
  const[updatedAt,setUpdatedAt]=useState("");
  const[source,setSource]=useState("");
  const[loading,setLoading]=useState(true);
  const[refreshing,setRefreshing]=useState(false);
  const[tab,setTab]=useState<Tab>("all");
  const[sport,setSport]=useState("All");
  const[betType,setBetType]=useState("All Types");
  const[view,setView]=useState<View>("row");
  const[search,setSearch]=useState("");
  const[demo,setDemo]=useState(false);

  const load=useCallback(async(refresh=false)=>{
    if(refresh)setRefreshing(true);
    try{
      const p=new URLSearchParams({tab,sport,...(demo?{demo:"true"}:{})});
      const r=await fetch(`/api/bets?${p}`);
      const d=await r.json();
      setBets(d.bets||[]);setStats(d.stats||{});
      setUpdatedAt(d.updatedAt||new Date().toISOString());
      setSource(d.source||"");
    }catch(e){console.error(e);}
    finally{setLoading(false);setRefreshing(false);}
  },[tab,sport,demo]);

  useEffect(()=>{load();},[load]);
  // Auto-refresh every 5 minutes for 24/7 accuracy
  useEffect(()=>{
    const id=setInterval(()=>load(false),300000);
    return()=>clearInterval(id);
  },[load]);

  const shown=bets.filter(b=>{
    if(betType!=="All Types"&&b.betType!==betType)return false;
    if(search){
      const q=search.toLowerCase();
      return b.question.toLowerCase().includes(q)||b.sport.toLowerCase().includes(q)||b.betType.toLowerCase().includes(q)||(b.matchup||"").toLowerCase().includes(q);
    }
    return true;
  });

  const tabCounts:{[k in Tab]:number}={
    all:bets.length,
    "high-probability":bets.filter(b=>b.isHighProbability).length,
    underdogs:bets.filter(b=>b.isUnderdog).length,
    "high-edge":bets.filter(b=>b.isHighEdge).length,
  };

  return(
    <div className="min-h-screen" style={{background:"#000000"}}>
      <Navbar onRefresh={()=>load(true)} refreshing={refreshing}/>
      <StatsBar stats={stats} lastUpdated={updatedAt}/>

      {/* High-probability banner */}
      {tab==="high-probability"&&(
        <div className="px-6 py-3 border-b" style={{borderColor:"rgba(212,175,55,0.15)",background:"linear-gradient(90deg,rgba(212,175,55,0.07)0%,transparent 70%)"}}>
          <div className="flex items-center gap-3">
            <Zap size={16} style={{color:"#D4AF37"}}/>
            <div>
              <p className="text-xs font-bold tracking-widest" style={{color:"#D4AF37",letterSpacing:"0.1em",fontFamily:"Oswald"}}>HIGH PROBABILITY PLAYS — 70%+ IMPLIED ODDS</p>
              <p className="text-xs" style={{color:"#9A8F78"}}>Smart money markets — scanned live from Polymarket 24/7</p>
            </div>
          </div>
        </div>
      )}
      {tab==="underdogs"&&(
        <div className="px-6 py-3 border-b" style={{borderColor:"rgba(239,68,68,0.12)",background:"linear-gradient(90deg,rgba(239,68,68,0.05)0%,transparent 70%)"}}>
          <div className="flex items-center gap-3">
            <Target size={16} style={{color:"#F87171"}}/>
            <div>
              <p className="text-xs font-bold tracking-widest" style={{color:"#F87171",letterSpacing:"0.1em",fontFamily:"Oswald"}}>UNDERDOG SPOTTER — 10–40% PROBABILITY</p>
              <p className="text-xs" style={{color:"#9A8F78"}}>High-value underdogs with positive edge — where value hides</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex" style={{minHeight:"calc(100vh - 115px)"}}>
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-44 shrink-0 p-2 border-r" style={{borderColor:"rgba(255,255,255,0.05)",background:"#000"}}>
          <p className="text-xs font-bold tracking-widest px-2 py-1.5 pt-3" style={{color:"#3C3018",fontSize:9,letterSpacing:"0.12em",fontFamily:"Oswald"}}>SPORT</p>
          {SPORTS.map(s=>(
            <button key={s} onClick={()=>setSport(s)}
              className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all mb-0.5"
              style={{background:sport===s?"rgba(212,175,55,0.1)":"transparent",color:sport===s?"#D4AF37":"#9A8F78",border:sport===s?"1px solid rgba(212,175,55,0.18)":"1px solid transparent",fontWeight:sport===s?600:400}}>
              {SPORT_LABEL[s]}
            </button>
          ))}
          <p className="text-xs font-bold tracking-widest px-2 py-1.5 pt-4" style={{color:"#3C3018",fontSize:9,letterSpacing:"0.12em",fontFamily:"Oswald"}}>BET TYPE</p>
          {TYPES.map(t=>(
            <button key={t} onClick={()=>setBetType(t)}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all mb-0.5"
              style={{background:betType===t?"rgba(212,175,55,0.08)":"transparent",color:betType===t?"#D4AF37":"#9A8F78",border:betType===t?"1px solid rgba(212,175,55,0.12)":"1px solid transparent",fontWeight:betType===t?600:400}}>
              {t}
            </button>
          ))}

          {/* Live/Demo toggle */}
          <div className="mt-auto pb-3 px-2 pt-4">
            <p className="text-xs font-bold tracking-widest mb-1.5" style={{color:"#3C3018",fontSize:9,letterSpacing:"0.12em",fontFamily:"Oswald"}}>DATA SOURCE</p>
            <button onClick={()=>setDemo(d=>!d)}
              className="w-full px-2 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{background:demo?"rgba(212,175,55,0.1)":"rgba(34,197,94,0.08)",color:demo?"#D4AF37":"#22C55E",border:demo?"1px solid rgba(212,175,55,0.2)":"1px solid rgba(34,197,94,0.18)"}}>
              {demo?"📋 Demo Data":"🔴 Live Polymarket"}
            </button>
            {source&&<p className="text-xs mt-1 text-center" style={{color:"#3C3018"}}>{source}</p>}
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {/* Tab bar */}
          <div className="sticky top-[57px] z-40 flex items-center justify-between px-4 border-b"
            style={{background:"rgba(0,0,0,0.99)",backdropFilter:"blur(12px)",borderColor:"rgba(255,255,255,0.06)"}}>
            <div className="flex items-stretch gap-0 overflow-x-auto">
              {TABS.map(([id,lbl,icon,color])=>(
                <button key={id} onClick={()=>setTab(id)}
                  className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap"
                  style={{color:tab===id?color:"#9A8F78",borderBottom:tab===id?`2px solid ${color}`:"2px solid transparent"}}>
                  <span style={{color:tab===id?color:"#3C3018"}}>{icon}</span>
                  {lbl}
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                    style={{background:tab===id?`rgba(${color==="#D4AF37"?"212,175,55":color==="#F87171"?"248,113,113":color==="#22C55E"?"34,197,94":"245,240,232"},0.12)`:"#0a0a04",color:tab===id?color:"#3C3018"}}>
                    {tabCounts[id]}
                  </span>
                </button>
              ))}
            </div>
            {/* Controls */}
            <div className="flex items-center gap-2 pl-2 shrink-0">
              <div className="relative flex items-center" style={{background:"#0a0a04",border:"1px solid #1a1a08",borderRadius:8}}>
                <Search size={11} className="absolute left-2.5" style={{color:"#9A8F78"}}/>
                <input type="text" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}
                  className="pl-7 pr-3 py-1.5 text-xs bg-transparent outline-none w-32" style={{color:"#F5F0E8"}}/>
              </div>
              <div className="flex rounded-lg overflow-hidden" style={{border:"1px solid #1a1a08"}}>
                <button onClick={()=>setView("row")} className="p-1.5" style={{background:view==="row"?"#111108":"transparent",color:view==="row"?"#D4AF37":"#9A8F78"}}><LayoutList size={13}/></button>
                <button onClick={()=>setView("card")} className="p-1.5" style={{background:view==="card"?"#111108":"transparent",color:view==="card"?"#D4AF37":"#9A8F78"}}><LayoutGrid size={13}/></button>
              </div>
            </div>
          </div>

          {/* Table header (row mode) */}
          {view==="row"&&(
            <div className="flex items-center border-b pl-0.5" style={{borderColor:"rgba(255,255,255,0.05)",background:"#030300"}}>
              <div className="w-40 shrink-0 px-3 py-2 border-r" style={{borderColor:"rgba(255,255,255,0.05)"}}><span className="text-xs font-bold tracking-widest" style={{color:"#3C3018",fontSize:9,fontFamily:"Oswald"}}>GAME</span></div>
              <div className="flex-1 px-4 py-2 border-r" style={{borderColor:"rgba(255,255,255,0.05)"}}><span className="text-xs font-bold tracking-widest" style={{color:"#3C3018",fontSize:9,fontFamily:"Oswald"}}>PLAYER / MARKET</span></div>
              <div className="w-32 shrink-0 px-3 py-2 border-r text-center" style={{borderColor:"rgba(255,255,255,0.05)"}}><span className="text-xs font-bold tracking-widest" style={{color:"#3C3018",fontSize:9,fontFamily:"Oswald"}}>BET TYPE</span></div>
              <div className="w-28 shrink-0 px-4 py-2 border-r text-center" style={{borderColor:"rgba(255,255,255,0.05)"}}><span className="text-xs font-bold tracking-widest" style={{color:"#3C3018",fontSize:9,fontFamily:"Oswald"}}>ODDS / PROB</span></div>
              <div className="w-20 shrink-0 px-3 py-2 text-center"><span className="text-xs font-bold tracking-widest" style={{color:"#3C3018",fontSize:9,fontFamily:"Oswald"}}>EDGE</span></div>
              <div className="w-7 shrink-0"/>
            </div>
          )}

          {loading?(
            <div className="flex flex-col items-center py-24 gap-3">
              <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{borderColor:"#111108",borderTopColor:"#D4AF37"}}/>
              <p className="text-xs" style={{color:"#9A8F78"}}>Scanning Polymarket 24/7...</p>
            </div>
          ):shown.length===0?(
            <div className="flex flex-col items-center py-24">
              <Trophy size={28} style={{color:"#3C3018",marginBottom:12}}/>
              <p className="text-sm font-medium" style={{color:"#C8BFA8"}}>No bets found</p>
              <p className="text-xs mt-1 max-w-xs text-center" style={{color:"#9A8F78"}}>
                {demo?"Switch to Live Polymarket data to see real-time markets.":"No active sports markets match right now. Markets refresh every 5 minutes."}
              </p>
            </div>
          ):view==="row"?(
            <div>{shown.map(b=><BetRow key={b.id} bet={b}/>)}</div>
          ):(
            <div className="p-4 grid gap-3" style={{gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))"}}>
              {shown.map(b=><BetCard key={b.id} bet={b}/>)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
