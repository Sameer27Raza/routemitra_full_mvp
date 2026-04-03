import { useState, useEffect } from "react";
import { getHeatmap, getRevenue } from "../api";

export default function AdminScreen() {
  const [heatmap, setHeatmap] = useState(null);
  const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    getHeatmap().then(setHeatmap).catch(() => {});
    getRevenue().then(setRevenue).catch(() => {});
  }, []);

  const maxDemand = heatmap ? Math.max(...heatmap.heatmap.map(x => x.demand)) : 1;

  return (
    <div style={{ padding:20 }}>
      <div style={{ fontSize:20, fontWeight:600, marginBottom:4 }}>Admin Dashboard</div>
      <div style={{ fontSize:13, color:"#888", marginBottom:20 }}>Bus owners & municipality view</div>

      {revenue && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          {[
            ["Aaj ke checkins", revenue.today.digital_checkins],
            ["Coins issued", revenue.today.coins_issued],
            ["Revenue (est.)", `₹${revenue.today.estimated_revenue_inr}`],
            ["Active routes", Object.keys(revenue.routes_performance || {}).length || 6],
          ].map(([label, val]) => (
            <div key={label} style={{ background:"#f5f5f0", borderRadius:10, padding:"14px 12px" }}>
              <div style={{ fontSize:11, color:"#888", marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:22, fontWeight:700, color:"#1a1a1a" }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      {heatmap && (
        <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:12, padding:16, marginBottom:20 }}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>Stop Demand Heatmap</div>
          {heatmap.heatmap.slice(0, 8).map(({ stop, demand }) => (
            <div key={stop} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}>
                <span>{stop.split(",")[0]}</span>
                <span style={{ color:"#888" }}>{demand} log</span>
              </div>
              <div style={{ background:"#eee", borderRadius:4, height:8 }}>
                <div style={{
                  width:`${(demand/maxDemand)*100}%`, height:8, borderRadius:4,
                  background: demand > maxDemand*0.7 ? "#D85A30" : demand > maxDemand*0.4 ? "#BA7517" : "#1D9E75"
                }}/>
              </div>
            </div>
          ))}
          <div style={{ fontSize:11, color:"#aaa", marginTop:8 }}>
            🔴 High demand  🟡 Medium  🟢 Low
          </div>
        </div>
      )}

      <div style={{ background:"#e8f5e9", borderRadius:12, padding:16 }}>
        <div style={{ fontSize:14, fontWeight:600, marginBottom:6 }}>B2G Data Export</div>
        <div style={{ fontSize:13, color:"#444", marginBottom:12 }}>
          Yeh demand data Ludhiana Municipal Corporation ko becha ja sakta hai route planning ke liye.
        </div>
        <button style={{ background:"#1D9E75", color:"#fff", border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, cursor:"pointer" }}>
          Export Report (CSV)
        </button>
      </div>
    </div>
  );
}
