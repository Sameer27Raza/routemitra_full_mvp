import { useState, useEffect } from "react";
import { getRoutes, getETA } from "../api";

const COLORS = { "1":"#1D9E75","2":"#534AB7","3":"#D85A30","4":"#185FA5","5":"#BA7517","AUTO1":"#D4537E" };

export default function HomeScreen({ onSelectRoute }) {
  const [routes, setRoutes]   = useState([]);
  const [etas, setEtas]       = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    getRoutes().then(d => { setRoutes(d.routes); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!routes.length) return;
    routes.forEach(r => {
      getETA(r.id).then(e => setEtas(prev => ({ ...prev, [r.id]: e }))).catch(() => {});
    });
  }, [routes]);

  const filtered = routes.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.stops.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ background: "#1D9E75", padding: "20px 16px 16px", color: "#fff" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:22, fontWeight:600 }}>RouteMitra 🚌</div>
            <div style={{ fontSize:13, opacity:0.85, marginTop:2 }}>Ludhiana — Live Bus Tracker</div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:20, padding:"4px 12px", fontSize:12 }}>
            Ludhiana
          </div>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Bus ya stop dhundho..."
          style={{ width:"100%", marginTop:12, padding:"10px 14px", borderRadius:10, border:"none", fontSize:14, background:"rgba(255,255,255,0.95)", color:"#1a1a1a" }}
        />
      </div>

      <div style={{ padding:"12px 16px" }}>
        <div style={{ fontSize:13, color:"#666", marginBottom:10 }}>
          {filtered.length} routes available
        </div>

        {loading && <div style={{ textAlign:"center", padding:40, color:"#999" }}>Routes load ho rahi hain...</div>}

        {filtered.map(r => {
          const eta = etas[r.id];
          const color = COLORS[r.id] || "#888";
          const first = r.stops[0].split(" ").slice(0,2).join(" ");
          const last  = r.stops[r.stops.length-1].split(" ").slice(0,2).join(" ");

          return (
            <div
              key={r.id}
              onClick={() => onSelectRoute(r.id)}
              style={{ background:"#fff", border:"1px solid #eee", borderRadius:12, padding:"14px 16px", marginBottom:10, cursor:"pointer", borderLeft:`4px solid ${color}` }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ background:color, color:"#fff", borderRadius:6, padding:"2px 10px", fontSize:13, fontWeight:600 }}>
                      Bus {r.id}
                    </span>
                    {eta?._offline && <span style={{ fontSize:11, color:"#999" }}>offline</span>}
                  </div>
                  <div style={{ fontSize:14, fontWeight:500, marginTop:6 }}>{first} → {last}</div>
                  <div style={{ fontSize:12, color:"#888", marginTop:2 }}>Har {r.frequency_min} min • {r.stops.length} stops</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  {eta ? (
                    <>
                      <div style={{ fontSize:22, fontWeight:700, color }}>
                        {eta.eta_minutes}<span style={{ fontSize:13, fontWeight:400 }}> min</span>
                      </div>
                      <div style={{ fontSize:11, color:"#999", maxWidth:90, textAlign:"right" }}>
                        {eta.delay_reason !== "clear roads" ? `⚠ ${eta.delay_reason}` : "✓ Clear"}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize:13, color:"#bbb" }}>loading...</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
