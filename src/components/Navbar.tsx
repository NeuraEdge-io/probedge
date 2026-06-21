"use client";
import { RefreshCw, ExternalLink, CloudRain, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps { onRefresh?: ()=>void; refreshing?: boolean; }

export function Navbar({ onRefresh, refreshing }: NavbarProps) {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-2 border-b"
      style={{ background:"rgba(0,0,0,0.97)", backdropFilter:"blur(12px)", borderColor:"#111108" }}>

      <Link href="/" className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0"
          style={{ border:"1px solid rgba(212,175,55,0.25)" }}>
          <Image src="/probedge_logo.jpeg" alt="ProbEdge" fill style={{ objectFit:"cover" }} priority/>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none"
            style={{ fontFamily:"Oswald", color:"#F5F0E8", letterSpacing:"0.05em" }}>
            Prob<span style={{ color:"#D4AF37" }}>Edge</span>
          </h1>
          <p className="text-xs leading-none mt-0.5" style={{ color:"#9A8F78" }}>Daily Best Bets</p>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-1">
        {[
          { href:"/",        label:"Best Bets",   icon:<TrendingUp size={13}/>, activeColor:"#D4AF37" },
          { href:"/weather", label:"MLB Weather", icon:<CloudRain  size={13}/>, activeColor:"#60A5FA" },
        ].map(({ href, label, icon, activeColor }) => {
          const active = path === href;
          return (
            <Link key={href} href={href}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: active ? `rgba(${activeColor==="#D4AF37"?"212,175,55":"96,165,250"},0.1)` : "transparent",
                color: active ? activeColor : "#9A8F78",
                border: active ? `1px solid rgba(${activeColor==="#D4AF37"?"212,175,55":"96,165,250"},0.2)` : "1px solid transparent",
              }}>
              {icon}{label}
            </Link>
          );
        })}
        <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 px-4 py-2 text-sm" style={{ color:"#9A8F78" }}>
          Polymarket <ExternalLink size={10}/>
        </a>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/weather" className="md:hidden p-2 rounded-lg"
          style={{ background:"#0a0a04", border:"1px solid #111108", color:"#60A5FA" }}>
          <CloudRain size={14}/>
        </Link>
        {onRefresh && (
          <button onClick={onRefresh} disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background:"#0a0a04", border:"1px solid #111108", color:"#C8BFA8" }}>
            <RefreshCw size={12} className={refreshing?"animate-spin":""} style={{ color:"#D4AF37" }}/>
            {refreshing?"Refreshing...":"Refresh"}
          </button>
        )}
      </div>
    </nav>
  );
}
