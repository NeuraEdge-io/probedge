// MLB stadium database + weather impact model
// Physics calibrated to OddsTrader/Baseball Savant methodology

export interface Stadium {
  name: string; city: string; state: string;
  lat: number; lon: number;
  isDome: boolean; elevation: number; // feet ASL
}

export const STADIUMS: Record<string, Stadium> = {
  NYY:{ name:"Yankee Stadium",           city:"Bronx",           state:"NY", lat:40.8296, lon:-73.9262, isDome:false, elevation:55   },
  NYM:{ name:"Citi Field",               city:"Queens",          state:"NY", lat:40.7571, lon:-73.8458, isDome:false, elevation:20   },
  BOS:{ name:"Fenway Park",              city:"Boston",          state:"MA", lat:42.3467, lon:-71.0972, isDome:false, elevation:20   },
  LAD:{ name:"Dodger Stadium",           city:"Los Angeles",     state:"CA", lat:34.0739, lon:-118.240, isDome:false, elevation:512  },
  SF: { name:"Oracle Park",              city:"San Francisco",   state:"CA", lat:37.7786, lon:-122.389, isDome:false, elevation:10   },
  CHC:{ name:"Wrigley Field",            city:"Chicago",         state:"IL", lat:41.9484, lon:-87.6553, isDome:false, elevation:595  },
  CWS:{ name:"Guaranteed Rate Field",    city:"Chicago",         state:"IL", lat:41.8300, lon:-87.6338, isDome:false, elevation:594  },
  ATL:{ name:"Truist Park",              city:"Cumberland",      state:"GA", lat:33.8907, lon:-84.4677, isDome:false, elevation:1050 },
  MIA:{ name:"loanDepot park",           city:"Miami",           state:"FL", lat:25.7781, lon:-80.2197, isDome:true,  elevation:6    },
  PHI:{ name:"Citizens Bank Park",       city:"Philadelphia",    state:"PA", lat:39.9061, lon:-75.1665, isDome:false, elevation:20   },
  WSH:{ name:"Nationals Park",           city:"Washington",      state:"DC", lat:38.8730, lon:-77.0074, isDome:false, elevation:25   },
  PIT:{ name:"PNC Park",                 city:"Pittsburgh",      state:"PA", lat:40.4469, lon:-80.0057, isDome:false, elevation:730  },
  CIN:{ name:"Great American Ball Park", city:"Cincinnati",      state:"OH", lat:39.0979, lon:-84.5082, isDome:false, elevation:490  },
  MIL:{ name:"American Family Field",    city:"Milwaukee",       state:"WI", lat:43.0283, lon:-87.9712, isDome:false, elevation:635  },
  STL:{ name:"Busch Stadium",            city:"St. Louis",       state:"MO", lat:38.6226, lon:-90.1928, isDome:false, elevation:465  },
  MIN:{ name:"Target Field",             city:"Minneapolis",     state:"MN", lat:44.9817, lon:-93.2781, isDome:false, elevation:830  },
  DET:{ name:"Comerica Park",            city:"Detroit",         state:"MI", lat:42.3390, lon:-83.0485, isDome:false, elevation:600  },
  CLE:{ name:"Progressive Field",        city:"Cleveland",       state:"OH", lat:41.4962, lon:-81.6852, isDome:false, elevation:660  },
  KC: { name:"Kauffman Stadium",         city:"Kansas City",     state:"MO", lat:39.0517, lon:-94.4803, isDome:false, elevation:1000 },
  HOU:{ name:"Daikin Park",              city:"Houston",         state:"TX", lat:29.7572, lon:-95.3555, isDome:false, elevation:43   },
  TEX:{ name:"Globe Life Field",         city:"Arlington",       state:"TX", lat:32.7473, lon:-97.0845, isDome:true,  elevation:600  },
  ATH:{ name:"Sutter Health Park",       city:"Sacramento",      state:"CA", lat:38.5816, lon:-121.494, isDome:false, elevation:30   },
  OAK:{ name:"Sutter Health Park",       city:"Sacramento",      state:"CA", lat:38.5816, lon:-121.494, isDome:false, elevation:30   },
  SEA:{ name:"T-Mobile Park",            city:"Seattle",         state:"WA", lat:47.5914, lon:-122.332, isDome:false, elevation:175  },
  LAA:{ name:"Angel Stadium",            city:"Anaheim",         state:"CA", lat:33.8003, lon:-117.882, isDome:false, elevation:160  },
  COL:{ name:"Coors Field",              city:"Denver",          state:"CO", lat:39.7559, lon:-104.994, isDome:false, elevation:5200 },
  ARI:{ name:"Chase Field",              city:"Phoenix",         state:"AZ", lat:33.4453, lon:-112.066, isDome:true,  elevation:1090 },
  AZ: { name:"Chase Field",              city:"Phoenix",         state:"AZ", lat:33.4453, lon:-112.066, isDome:true,  elevation:1090 },
  SD: { name:"Petco Park",               city:"San Diego",       state:"CA", lat:32.7076, lon:-117.156, isDome:false, elevation:62   },
  TB: { name:"Tropicana Field",          city:"St. Petersburg",  state:"FL", lat:27.7682, lon:-82.6534, isDome:true,  elevation:43   },
  BAL:{ name:"Camden Yards",             city:"Baltimore",       state:"MD", lat:39.2838, lon:-76.6218, isDome:false, elevation:20   },
  TOR:{ name:"Rogers Centre",            city:"Toronto",         state:"ON", lat:43.6414, lon:-79.3894, isDome:true,  elevation:250  },
};

// Today's real MLB schedule (pitchers from latest Rotoworld/FantasyPros data)
export const TODAY_GAMES = [
  { away:"CWS", home:"DET", awayP:"S. Newcomb (L)",  homeP:"T. Melton (R)",     time:"1:10 PM ET", stadKey:"DET" },
  { away:"CIN", home:"NYY", awayP:"A. Abbott (L)",   homeP:"W. Warren (R)",     time:"1:35 PM ET", stadKey:"NYY" },
  { away:"TOR", home:"CHC", awayP:"P. Corbin (L)",   homeP:"C. Rea (R)",        time:"2:20 PM ET", stadKey:"CHC" },
  { away:"SD",  home:"TEX", awayP:"W. Buehler (R)",  homeP:"N. Eovaldi (R)",    time:"4:05 PM ET", stadKey:"TEX" },
  { away:"MIL", home:"ATL", awayP:"K. Harrison (L)", homeP:"C. Sale (L)",       time:"4:10 PM ET", stadKey:"ATL" },
  { away:"SF",  home:"MIA", awayP:"T. McDonald (R)", homeP:"M. Meyer (R)",      time:"4:10 PM ET", stadKey:"MIA" },
  { away:"WSH", home:"TB",  awayP:"C. Cavalli (R)",  homeP:"I. Seymour (L)",    time:"4:10 PM ET", stadKey:"TB"  },
  { away:"NYM", home:"PHI", awayP:"F. Peralta (R)",  homeP:"C. Sanchez (L)",    time:"7:15 PM ET", stadKey:"PHI" },
  { away:"CLE", home:"HOU", awayP:"J. Cantillo (L)", homeP:"S. Arrighetti (R)", time:"8:10 PM ET", stadKey:"HOU" },
  { away:"PIT", home:"COL", awayP:"P. Skenes (R)",   homeP:"T. Sugano (R)",     time:"9:10 PM ET", stadKey:"COL" },
  { away:"LAA", home:"ATH", awayP:"W. Urena (R)",    homeP:"J. Ginn (R)",       time:"10:05 PM ET",stadKey:"ATH" },
  { away:"BOS", home:"SEA", awayP:"C. Early (L)",    homeP:"E. Hancock (R)",    time:"10:10 PM ET",stadKey:"SEA" },
  { away:"BAL", home:"LAD", awayP:"T. Rogers (L)",   homeP:"Y. Yamamoto (R)",   time:"10:10 PM ET",stadKey:"LAD" },
  { away:"MIN", home:"ARI", awayP:"T. Bradley (R)",  homeP:"Z. Gallen (R)",     time:"10:10 PM ET",stadKey:"ARI" },
];

// Wind direction relative to batter — most parks orient HP toward NE
export type WindDir = "OUT"|"IN"|"L→R"|"R→L"|"DOME";

export function getWindDir(deg: number): WindDir {
  const n = ((deg % 360) + 360) % 360;
  if (n >= 157.5 && n < 247.5) return "OUT";  // S/SW → blows to outfield
  if (n >= 337.5 || n < 67.5)  return "IN";   // N/NE → blows in from OF
  if (n >= 67.5  && n < 157.5) return "L→R";
  return "R→L";
}

export function compassPt(deg: number): string {
  return ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"][Math.round(deg/22.5)%16];
}

export interface Impact {
  battingField:  "Ideal"|"Normal"|"Poor";
  pitchingField: "Ideal"|"Normal"|"Poor";
  battingWind:   "Ideal"|"Normal"|"Poor";
  pitchingWind:  "Ideal"|"Normal"|"Poor";
  hrBoost:  number;   // % change in HR odds vs baseline
  ouBias:   "Strong Over"|"Slight Over"|"Neutral"|"Slight Under"|"Strong Under";
  summary:  string;
  rainRisk: boolean;
}

export function calcImpact(
  temp: number, humidity: number,
  windSpd: number, windDir: WindDir,
  precip: number, stad: Stadium
): Impact {
  if (stad.isDome) return {
    battingField:"Normal", pitchingField:"Normal",
    battingWind:"Normal",  pitchingWind:"Normal",
    hrBoost:0, ouBias:"Neutral",
    summary:"Domed stadium — weather has no impact on play",
    rainRisk:false,
  };

  let bf=0, pf=0, bw=0, pw=0, hr=0;

  // Temperature: +4.5 ft per 10°F above 70°F (Baseball Savant calibration)
  const td = temp - 70;
  hr += td * 0.45;
  bf += Math.max(-2, Math.min(2, td / 15));
  pf -= Math.max(-1, Math.min(1, td / 20));

  // Humidity: high = denser air
  if (humidity > 70)      { hr -= 1.5; bf -= 0.4; pf += 0.4; }
  else if (humidity < 35) { hr += 1.0; bf += 0.3; }

  // Altitude
  if (stad.elevation >= 5000)      { hr += 8;   bf += 2.5; pf -= 2.0; }
  else if (stad.elevation >= 2500) { hr += 2.5; bf += 0.8; pf -= 0.5; }
  else if (stad.elevation >= 1500) { hr += 0.8; bf += 0.2; }

  // Wind (per Baseball Savant: 10mph OUT ≈ +3ft; 10mph IN ≈ -2ft; cross ≈ -1.5ft)
  if (windSpd >= 3) {
    const f = windSpd / 10;
    if (windDir === "OUT")  { hr += f*4.0; bw += f*2.0; pw -= f*2.0; }
    if (windDir === "IN")   { hr -= f*3.5; bw -= f*1.5; pw += f*1.5; }
    if (windDir === "L→R" || windDir === "R→L") { hr -= f*1.5; bw -= f*0.7; pw -= f*0.4; }
  }

  const r = (v: number): "Ideal"|"Normal"|"Poor" =>
    v >= 1.5 ? "Ideal" : v <= -1.2 ? "Poor" : "Normal";

  let ouBias: Impact["ouBias"] = "Neutral";
  if      (hr > 6)   ouBias = "Strong Over";
  else if (hr > 2.5) ouBias = "Slight Over";
  else if (hr < -6)  ouBias = "Strong Under";
  else if (hr < -2.5)ouBias = "Slight Under";

  let summary = "Neutral conditions — no significant weather betting edge";
  if (stad.elevation >= 5000)           summary = `Coors Field altitude (${stad.elevation.toLocaleString()}ft) — HR odds significantly elevated`;
  else if (windDir==="OUT"&&windSpd>=12) summary = `${windSpd} mph OUT wind — elevated HR conditions, lean Over`;
  else if (windDir==="IN" &&windSpd>=12) summary = `${windSpd} mph IN wind — suppressed scoring, lean Under`;
  else if (temp >= 90)                   summary = `${temp}°F heat — ball carries well, slight batter advantage`;
  else if (temp <= 52)                   summary = `${temp}°F cold — denser air reduces carry, favor pitchers`;
  else if (precip >= 50)                 summary = `${precip}% rain chance — monitor for delays`;

  return {
    battingField: r(bf), pitchingField: r(pf),
    battingWind:  r(bw), pitchingWind:  r(pw),
    hrBoost: Math.round(hr*10)/10, ouBias, summary,
    rainRisk: precip >= 40,
  };
}
