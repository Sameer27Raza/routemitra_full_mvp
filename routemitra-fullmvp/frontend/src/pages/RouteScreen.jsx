import { useState, useEffect } from "react";
import { getRoutes, getETA, checkin } from "../api";

export default function RouteScreen({ routeId, onBack }) {
  const [route,   setRoute]   = useState(null);
  const [eta,     setEta]     = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [coinMsg,  setCoinMsg]  = useState("");
  const [selStop,  setSelStop]  = useState(null);

  const userId = "user_" + (localStorage.getItem("uid") || (() => {
    const id = Math.random().toString(36).slice(2,8);
    localStorage.setItem("uid", id);
    return id;
  })());

  useEffect(() => {
    getRoutes().then(d => {
      const r = d.routes.find(x => x.id === routeId);
      setRoute(r);
      if (r) setSelStop(r.stops[0]);
    });
  }, [routeId]);

  useEffect(() => {
    if (!selStop) return;
    setEta(null);
    getETA(routeId, selStop).then(setEta).catch(() => {});
  }, [routeId, selStop]);

  const handleCheckin = async () => {
    if (!selStop) return;
    try {
      const res = await checkin(routeId, selStop, userId);
      setCheckedIn(true);
      setCoinMsg(res.message);
      setTimeout(() => { setCheckedIn(false); setCoinMsg(""); }, 4000);
    } catch {
      setCoinMsg("Check-in failed — internet chahiye");
    }
  };

  if (!route) return <div style={{ padding:40, textAlign:"center", color:"#999" }}>Loading...</div>;

  return (
    <div>
      <div style={{ background:"#1D9E75", padding:"16px", color:"#fff" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:13, marginBottom:12 }}>
          ← Wapas
        </button>
        <div style={{ fontSize:20, fontWeight:600 }}>Bus {routeId}</div>
        <div style={{ fontSize:13, opacity:0.85 }}>{route.stops[0]} → {route.stops[route.stops.length-1]}</div>
      </div>

      <div style={{ padding:"16px" }}>
        {eta && (
          <div style={{ background:"#f0faf5", border:"1px solid #1D9E75", borderRadius:12, padding:16, marginBottom:16, textAlign:"center" }}>
            <div style={{ fontSize:13, color:"#666" }}>
              {selStop} pe ETA
            </div>
            <div style={{ fontSize:40, fontWeight:700, color:"#1D9E75" }}>
              {eta.eta_minutes} <span style={{ fontSize:18, fontWeight:400 }}>min</span>
            </div>
            <div style={{ fontSize:12, color:"#888" }}>
              Bus abhi: {eta.current_stop}
              {eta.delay_reason !== "clear roads" && ` • ⚠ ${eta.delay_reason}`}
            </div>
          </div>
        )}

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:500, color:"#444", marginBottom:8 }}>Stop chunein:</div>
          {route.stops.map((stop, i) => (
            <div
              key={stop}
              onClick={() => setSelStop(stop)}
              style={{
                display:"flex", alignItems:"center", gap:12, padding:"10px 12px",
                borderRadius:8, cursor:"pointer", marginBottom:4,
                background: selStop === stop ? "#f0faf5" : "transparent",
                border: selStop === stop ? "1px solid #1D9E75" : "1px solid transparent",
              }}
            >
              <div style={{
                width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                background: selStop === stop ? "#1D9E75" : "#eee",
                color: selStop === stop ? "#fff" : "#888", fontSize:12, fontWeight:600, flexShrink:0
              }}>{i+1}</div>
              <div>
                <div style={{ fontSize:14, fontWeight: selStop===stop?600:400 }}>{stop}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:"#fffbea", border:"1px solid #FAC775", borderRadius:12, padding:16 }}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>🪙 Transit Coins kamao!</div>
          <div style={{ fontSize:13, color:"#666", marginBottom:12 }}>
            Is bus mein ho? Check-in karo aur 10 coins pao. Coins se ticket par discount milega!
          </div>
          {coinMsg && (
            <div style={{ background:"#f0faf5", borderRadius:8, padding:10, fontSize:13, color:"#0F6E56", marginBottom:10 }}>
              {coinMsg}
            </div>
          )}
          <button
            onClick={handleCheckin}
            disabled={checkedIn}
            style={{
              width:"100%", padding:"12px", borderRadius:10, border:"none", cursor: checkedIn?"default":"pointer",
              background: checkedIn?"#ccc":"#1D9E75", color:"#fff", fontSize:15, fontWeight:600
            }}
          >
            {checkedIn ? "✓ Check-in hua!" : "Bus mein hoon — Check In"}
          </button>
        </div>
      </div>
    </div>
  );
}
