import { NextResponse } from "next/server";
import { STADIUMS, TODAY_GAMES, getWindDir, calcImpact, compassPt, WindDir, Impact } from "@/lib/stadiums";

export const revalidate = 900; // 15 min

export interface Hourly { t:string; temp:number; rain:number; wind:number; icon:string }

export interface GameWx {
  away:string; home:string; awayP:string; homeP:string; time:string;
  stadName:string; city:string; state:string; elevation:number; isDome:boolean;
  temp:number; humidity:number; windSpd:number; windDeg:number;
  windDir:WindDir; compass:string; windLabel:string;
  precip:number; condition:string; icon:string;
  impact:Impact; hourly:Hourly[];
}

function wmo(code:number):{label:string;icon:string}{
  if(code>=95)return{label:"Thunderstorm",icon:"⛈️"};
  if(code>=80)return{label:"Rain Showers",icon:"🌦️"};
  if(code>=71)return{label:"Snow",icon:"❄️"};
  if(code>=61)return{label:"Rain",icon:"🌧️"};
  if(code>=51)return{label:"Drizzle",icon:"🌦️"};
  if(code>=45)return{label:"Fog",icon:"🌫️"};
  if(code>=3) return{label:"Cloudy",icon:"☁️"};
  if(code>=1) return{label:"Partly Cloudy",icon:"⛅"};
  return          {label:"Clear",icon:"☀️"};
}

async function fetchWx(lat:number,lon:number){
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
    +`&current=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,wind_direction_10m,weather_code`
    +`&hourly=temperature_2m,precipitation_probability,wind_speed_10m,weather_code`
    +`&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=1&timezone=auto`;
  const r=await fetch(url,{next:{revalidate:900}});
  if(!r.ok)return null;
  return r.json();
}

export async function GET(){
  const games:GameWx[]=[];

  for(const g of TODAY_GAMES){
    const stad=STADIUMS[g.stadKey]||STADIUMS[g.home];
    if(!stad)continue;

    let temp=72,humidity=45,windSpd=0,windDeg=270,precip=0;
    let condition="Clear",icon="☀️",windDir:WindDir="DOME",compass="—";
    const hourly:Hourly[]=[];

    if(stad.isDome){
      windDir="DOME"; icon="🏟️"; condition="Dome";
    } else {
      try{
        const d=await fetchWx(stad.lat,stad.lon);
        if(d?.current){
          const c=d.current;
          temp=Math.round((c.temperature_2m??72)*10)/10;
          humidity=c.relative_humidity_2m??50;
          windSpd=Math.round((c.wind_speed_10m??0)*10)/10;
          windDeg=c.wind_direction_10m??270;
          precip=c.precipitation_probability??0;
          const w=wmo(c.weather_code??0);
          condition=w.label; icon=w.icon;
          windDir=getWindDir(windDeg);
          compass=compassPt(windDeg);
          // Hourly next 4h
          if(d.hourly?.time){
            const nowH=new Date().getHours();
            for(let i=0;i<4;i++){
              const idx=nowH+i;
              if(idx>=(d.hourly.time?.length??0))break;
              const{icon:hi}=wmo(d.hourly.weather_code?.[idx]??0);
              const ht=new Date(d.hourly.time[idx]);
              hourly.push({
                t:ht.toLocaleTimeString("en-US",{hour:"numeric",hour12:true}),
                temp:Math.round(d.hourly.temperature_2m?.[idx]??72),
                rain:d.hourly.precipitation_probability?.[idx]??0,
                wind:Math.round(d.hourly.wind_speed_10m?.[idx]??0),
                icon:hi,
              });
            }
          }
        }
      }catch{/* fallback to defaults */}
    }

    const windLabel=stad.isDome?"Domed Stadium":`${compass} ${windSpd} mph — ${windDir}`;
    const impact=calcImpact(temp,humidity,windSpd,windDir,precip,stad);

    games.push({
      away:g.away,home:g.home,awayP:g.awayP,homeP:g.homeP,time:g.time,
      stadName:stad.name,city:stad.city,state:stad.state,
      elevation:stad.elevation,isDome:stad.isDome,
      temp,humidity,windSpd,windDeg,windDir,compass,windLabel,
      precip,condition,icon,impact,hourly,
    });
  }

  return NextResponse.json({
    games,
    date:new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}),
    updatedAt:new Date().toISOString(),
  });
}
