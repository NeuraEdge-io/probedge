"use client";
import { useState, useEffect, useCallback } from "react";
import { GameWx } from "@/app/api/weather/route";
import { Navbar } from "@/components/Navbar";
import { RefreshCw, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const TC: Record<string,string> = {
  NYY:"#003087",NYM:"#002D72",BOS:"#BD3039",LAD:"#005A9C",SF:"#FD5A1E",
  CHC:"#0E3386",CWS:"#27251F",ATL:"#CE1141",MIA:"#00A3E0",PHI:"#E81828",
  WSH:"#AB0003",PIT:"#FDB827",CIN:"#C6011F",MIL:"#B6922E",STL:"#C41E3A",
  MIN:"#002B5C",DET:"#0C2C56",CLE:"#E31937",KC:"#004687",HOU:"#002D62",
  TEX:"#003278",ATH:"#003831",OAK:"#003831",SEA:"#0C2C56",LAA:"#BA0021",
  COL:"#33006F",ARI:"#A71930",AZ:"#A71930",SD:"#2F241D",TB:"#092C5C",
  BAL:"#DF4601",TOR:"#134A8E",
};

type R = "Ideal"|"Normal"|"Poor";
const RS = (r:R) => r==="Ideal"
  ? {bg:"rgba(34,197,94,0.12)",  bd:"rgba(34,197,94,0.3)",  tx:"#22C55E"}
  : r==="Poor"
  ? {bg:"rgba(239,68,68,0.10)",  bd:"rgba(239,68,68,0.28)", tx:"#F87171"}
  : {bg:"rgba(212,175,55,0.08)", bd:"rgba(212,175,55,0.2)", tx:"#D4AF37"};

function Chip({label,r}:{label:string;r:R}){
  const s=RS(r);
  return(
    <div className="flex flex-col items-center gap-0.5">
      <span style={{color:"#3C3018",fontSize:9,fontWeight:700,letterSpacing:"0.08em"}}>{label}</span>
      <span className="px-2 py-0.5 rounded-full text-xs font-bold"
        style={{background:s.bg,border:`1px solid ${s.bd}`,color:s.tx}}>{r}</span>
    </div>
  );
}

function Team({abbr}:{abbr:string}){
  return(
    <div className="flex items-center gap-1.5">
      <span className="w-8 h-8 rounded-md flex items-center justify-center font-black text-white shrink-0"
        style={{background:TC[abbr]||"#222",fontSize:9,fontFamily:"Oswald"}}>{abbr}</span>
      <span className="font-bold" style={{color:"#F5F0E8",fontFamily:"Oswald",fontSize:14}}>{abbr}</span>
    </div>
  );
}

const WC:Record<string,string>={OUT:"#22C55E",IN:"#EF4444","L→R":"#F59E0B","R→L":"#F59E0B",DOME:"#9A8F78"};
const WA:Record<string,string>={OUT:"↑",IN:"↓","L→R":"→","R→L":"←",DOME:"—"};
const OUS:Record<string,{bg:string;color:string}>={
  "Strong Over": {bg:"rgba(34,197,94,0.15)", color:"#22C55E"},
  "Slight Over": {bg:"rgba(34,197,94,0.07)", color:"#4ADE80"},
  "Neutral":     {bg:"rgba(212,175,55,0.08)",color:"#D4AF37"},
  "Slight Under":{bg:"rgba(239,68,68,0.08)", color:"#F87171"},
  "Strong Under":{bg:"rgba(239,68,68,0.15)", color:"#EF4444"},
};

function Col({h,children}:{h:string;children:React.ReactNode}){
  return(
    <div className="flex flex-col items-center justify-center gap-1.5 p-3 border-r last:border-r-0"
      style={{borderColor:"rgba(255,255,255,0.06)",minHeight:128}}>
      <p style={{color:"#3C3018",fontSize:9,fontWeight:700,letterSpacing:"0.09em",marginBottom:2}}>{h}</p>
      {children}
    </div>
  );
}

function Card({g}:{g:GameWx}){
  const[open,setOpen]=useState(false);
  const wc=WC[g.windDir]||"#9A8F78";
  const ous=OUS[g.impact.ouBias]||OUS["Neutral"];
  return(
    <div className="rounded-xl overflow-hidden"
      style={{background:"#08080600",backgroundColor:"#080806",
        border:g.impact.rainRisk?"1px solid rgba(239,68,68,0.28)":"1px solid rgba(255,255,255,0.07)"}}>

      {/* Rain alert */}
      {g.impact.rainRisk&&!g.isDome&&(
        <div className="flex items-center gap-2 px-4 py-1.5"
          style={{background:"rgba(239,68,68,0.08)",borderBottom:"1px solid rgba(239,68,68,0.15)"}}>
          <AlertTriangle size={11} style={{color:"#EF4444"}}/>
          <span className="text-xs font-bold" style={{color:"#EF4444"}}>{g.precip}% Rain — Monitor for Delay</span>
        </div>
      )}

      <div className="p-4">
        {/* Header: teams, pitchers, game info */}
        <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div><Team abbr={g.away}/><p className="text-xs mt-0.5" style={{color:"#5C5040"}}>{g.awayP}</p></div>
            <span className="font-bold text-lg" style={{color:"#1C1C10"}}>@</span>
            <div><Team abbr={g.home}/><p className="text-xs mt-0.5" style={{color:"#5C5040"}}>{g.homeP}</p></div>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm" style={{color:"#D4AF37"}}>{g.time}</p>
            <p className="text-xs" style={{color:"#9A8F78"}}>{g.stadName}</p>
            <p className="text-xs" style={{color:"#5C5040"}}>{g.city}, {g.state}</p>
            {g.elevation>=1500&&<p className="text-xs font-bold mt-0.5" style={{color:"#A78BFA"}}>⛰️ {g.elevation.toLocaleString()}ft</p>}
          </div>
        </div>

        {/* 5-column data grid */}
        <div className="grid rounded-lg overflow-hidden"
          style={{gridTemplateColumns:"repeat(5,1fr)",border:"1px solid rgba(255,255,255,0.06)"}}>

          <Col h="WEATHER">
            <span className="text-3xl">{g.icon}</span>
            <span className="text-xs font-medium text-center" style={{color:"#C8BFA8"}}>{g.condition}</span>
            <span className="text-xs" style={{color:"#5C5040"}}>{g.precip}% rain</span>
          </Col>

          <Col h="TEMPERATURE">
            <span className="text-2xl font-bold font-mono-nums" style={{color:"#F5F0E8"}}>
              {g.isDome?"72°F":`${g.temp.toFixed(0)}°F`}
            </span>
            <span className="text-xs" style={{color:"#5C5040"}}>{g.isDome?"Controlled":`${g.humidity}% humidity`}</span>
            <Chip label="BATTING"  r={g.impact.battingField}/>
            <Chip label="PITCHING" r={g.impact.pitchingField}/>
          </Col>

          <Col h="WIND">
            {g.isDome?(
              <><span className="text-2xl">🏟️</span><span className="text-xs" style={{color:"#9A8F78"}}>Domed</span></>
            ):(
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-3xl font-bold leading-none" style={{color:wc}}>{WA[g.windDir]}</span>
                  <div>
                    <p className="font-bold text-sm" style={{color:wc}}>{g.windSpd} mph</p>
                    <p className="text-xs font-bold" style={{color:wc,opacity:0.9}}>{g.windDir}</p>
                  </div>
                </div>
                <p className="text-xs text-center" style={{color:"#5C5040"}}>{g.compass} wind</p>
                <p className="text-xs font-medium" style={{color:wc}}>
                  {g.windDir==="OUT"?"→ Outfield":g.windDir==="IN"?"→ Home Plate":g.windDir==="L→R"?"Left to Right":"Right to Left"}
                </p>
              </>
            )}
          </Col>

          <Col h="WIND IMPACT">
            <Chip label="BATTING"  r={g.impact.battingWind}/>
            <Chip label="PITCHING" r={g.impact.pitchingWind}/>
            {!g.isDome&&g.windSpd>0&&(
              <p className="text-xs text-center mt-0.5" style={{color:"#3C3018"}}>
                {g.windSpd>=15?"Strong":g.windSpd>=8?"Moderate":g.windSpd>=3?"Mild":"Calm"} effect
              </p>
            )}
          </Col>

          <Col h="BETTING EDGE">
            {!g.isDome&&Math.abs(g.impact.hrBoost)>=0.5?(
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold" style={{color:"#3C3018"}}>HR ODDS SHIFT</span>
                <span className="text-xl font-bold font-mono-nums"
                  style={{color:g.impact.hrBoost>0?"#22C55E":"#EF4444"}}>
                  {g.impact.hrBoost>0?"+":""}{g.impact.hrBoost.toFixed(1)}%
                </span>
              </div>
            ):<span className="text-xs" style={{color:"#3C3018"}}>No change</span>}
            <span className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{background:ous.bg,color:ous.color}}>{g.impact.ouBias}</span>
          </Col>
        </div>

        {/* Summary */}
        <p className="mt-3 px-3 py-2 rounded-lg text-xs" style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",color:"#9A8F78"}}>
          📊 {g.impact.summary}
        </p>

        {/* Hourly toggle */}
        {g.hourly.length>0&&(
          <>
            <button onClick={()=>setOpen(o=>!o)}
              className="mt-3 w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs"
              style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",color:"#8B7536"}}>
              {open?<ChevronUp size={11}/>:<ChevronDown size={11}/>}
              {open?"Hide":"Show"} Hourly Forecast
            </button>
            {open&&(
              <div className="mt-2 grid gap-2" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
                {g.hourly.map((h,i)=>(
                  <div key={i} className="flex flex-col items-center gap-0.5 p-2 rounded-lg"
                    style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                    <span className="text-xs font-bold" style={{color:"#D4AF37"}}>{h.t}</span>
                    <span className="text-xl">{h.icon}</span>
                    <span className="text-sm font-bold" style={{color:"#F5F0E8"}}>{h.temp}°</span>
                    <span className="text-xs" style={{color:"#5C5040"}}>{h.rain}% 💧</span>
                    <span className="text-xs" style={{color:"#5C5040"}}>{h.wind} mph</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function WeatherPage(){
  const[games,setGames]=useState<GameWx[]>([]);
  const[loading,setLoading]=useState(true);
  const[ref,setRef]=useState(false);
  const[ua,setUa]=useState("");
  const[date,setDate]=useState("");
  const[filter,setFilter]=useState<"all"|"outdoor"|"impact">("all");

  const load=useCallback(async(refresh=false)=>{
    if(refresh)setRef(true);
    try{
      const r=await fetch("/api/weather");
      const d=await r.json();
      setGames(d.games||[]);setUa(d.updatedAt||"");setDate(d.date||"");
    }catch{}finally{setLoading(false);setRef(false);}
  },[]);

  useEffect(()=>{load();},[load]);

  const outdoor=games.filter(g=>!g.isDome);
  const impact=games.filter(g=>Math.abs(g.impact.hrBoost)>3||g.impact.rainRisk);
  const shown=filter==="outdoor"?outdoor:filter==="impact"?impact:games;

  return(
    <div className="min-h-screen" style={{background:"#000000"}}>
      <Navbar onRefresh={()=>load(true)} refreshing={ref}/>

      <div className="px-6 py-5 border-b" style={{borderColor:"#111108",background:"#030300"}}>
        <Link href="/" className="text-xs mb-2 inline-block" style={{color:"#8B7536"}}>← Back to Best Bets</Link>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold" style={{fontFamily:"Oswald",color:"#F5F0E8",letterSpacing:"0.06em"}}>
              ⚾ MLB WEATHER REPORT
            </h1>
            <p className="text-sm mt-0.5" style={{color:"#9A8F78"}}>
              {date} · Live weather · Wind direction · HR odds impact · Batting & pitching analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            {ua&&<span className="text-xs" style={{color:"#3C3018"}}>Updated {new Date(ua).toLocaleTimeString()}</span>}
            <button onClick={()=>load(true)} disabled={ref}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{background:"#0a0a04",border:"1px solid #1a1a08",color:"#C8BFA8"}}>
              <RefreshCw size={11} className={ref?"animate-spin":""} style={{color:"#D4AF37"}}/>
              {ref?"Refreshing...":"Refresh"}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-3 flex-wrap">
          {[{v:games.length,l:"Games Today",c:"#D4AF37"},{v:outdoor.length,l:"Outdoor",c:"#22C55E"},
            {v:impact.length,l:"High Impact",c:"#EF4444"},{v:games.filter(g=>g.impact.rainRisk).length,l:"Rain Risk",c:"#F59E0B"}
          ].map(s=>(
            <div key={s.l}>
              <span className="text-xl font-bold font-mono-nums mr-1" style={{color:s.c}}>{s.v}</span>
              <span className="text-xs" style={{color:"#9A8F78"}}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center border-b px-6" style={{borderColor:"#111108",background:"#000"}}>
        {([["all",`All Games (${games.length})`],["outdoor",`Outdoor (${outdoor.length})`],["impact",`High Impact (${impact.length})`]] as const).map(([id,lbl])=>(
          <button key={id} onClick={()=>setFilter(id)} className="px-4 py-3 text-xs font-semibold"
            style={{color:filter===id?"#D4AF37":"#9A8F78",borderBottom:filter===id?"2px solid #D4AF37":"2px solid transparent"}}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Wind legend */}
      <div className="flex items-center gap-5 px-6 py-2 border-b flex-wrap"
        style={{borderColor:"#111108",background:"#030300"}}>
        <span style={{color:"#3C3018",fontSize:9,fontWeight:700,letterSpacing:"0.1em"}}>WIND KEY:</span>
        {[["↑ OUT","#22C55E","Tailwind — boosts HRs"],["↓ IN","#EF4444","Headwind — suppresses HRs"],
          ["→ L→R","#F59E0B","Left to right crosswind"],["← R→L","#F59E0B","Right to left crosswind"]
        ].map(([sym,c,tip])=>(
          <div key={sym} className="flex items-center gap-1">
            <span className="font-bold text-sm" style={{color:c}}>{sym}</span>
            <span className="text-xs" style={{color:"#3C3018"}}>— {tip}</span>
          </div>
        ))}
      </div>

      <div className="p-6">
        {loading?(
          <div className="flex flex-col items-center py-24 gap-3">
            <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{borderColor:"#111108",borderTopColor:"#D4AF37"}}/>
            <p className="text-xs" style={{color:"#9A8F78"}}>Fetching live weather from Open-Meteo...</p>
          </div>
        ):shown.length===0?(
          <p className="text-center py-16 text-sm" style={{color:"#9A8F78"}}>No games match this filter.</p>
        ):(
          <div className="grid gap-4" style={{gridTemplateColumns:"repeat(auto-fill,minmax(560px,1fr))"}}>
            {shown.map((g,i)=><Card key={i} g={g}/>)}
          </div>
        )}
      </div>

      {/* Methodology table */}
      <div className="mx-6 mb-8 rounded-xl p-5" style={{background:"#080806",border:"1px solid #111108"}}>
        <h3 className="text-sm font-bold mb-4" style={{fontFamily:"Oswald",color:"#D4AF37",letterSpacing:"0.08em"}}>
          WEATHER IMPACT METHODOLOGY
        </h3>
        <table className="w-full text-xs" style={{borderCollapse:"collapse"}}>
          <thead>
            <tr>{["Factor","Effect","Calculation"].map(h=>(
              <th key={h} className="text-left pb-2 pr-8 font-bold" style={{color:"#3C3018",fontSize:9,letterSpacing:"0.09em",borderBottom:"1px solid #111108"}}>{h.toUpperCase()}</th>
            ))}</tr>
          </thead>
          <tbody>
            {[
              ["Temperature","Ball carry distance","Every 10°F above 70°F adds ~4.5ft — Baseball Savant calibrated"],
              ["Humidity","Air density","High humidity = denser air = shorter carry"],
              ["Tailwind (OUT)","HR probability","10 mph OUT wind ≈ +3–4ft carry ≈ +4% HR odds"],
              ["Headwind (IN)","HR probability","10 mph IN wind ≈ −2–3ft carry ≈ −3.5% HR odds"],
              ["Crosswind","HR probability","10 mph cross ≈ −1.5ft carry ≈ −1.5% HR odds"],
              ["Altitude","Ball carry","Coors Field 5,200ft ≈ +8% HR odds vs sea level"],
              ["Rain >40%","Game conditions","Wet ball affects pitcher grip; delay risk"],
            ].map(([f,e,c])=>(
              <tr key={f} style={{borderBottom:"1px solid #060604"}}>
                <td className="py-2 pr-8 font-bold" style={{color:"#C8BFA8"}}>{f}</td>
                <td className="py-2 pr-8" style={{color:"#9A8F78"}}>{e}</td>
                <td className="py-2" style={{color:"#5C5040"}}>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
