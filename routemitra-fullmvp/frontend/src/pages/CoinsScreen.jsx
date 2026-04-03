// CoinsScreen.jsx
import { useState, useEffect } from "react";
import { getCoins } from "../api";

export default function CoinsScreen() {
  const [data, setData] = useState(null);
  const userId = "user_" + (localStorage.getItem("uid") || "guest");

  useEffect(() => { getCoins(userId).then(setData).catch(() => {}); }, []);

  return (
    <div style={{ padding:20 }}>
      <div style={{ fontSize:20, fontWeight:600, marginBottom:20 }}>🪙 Transit Coins</div>

      {data ? (
        <>
          <div style={{ background:"linear-gradient(135deg,#1D9E75,#0F6E56)", borderRadius:16, padding:24, color:"#fff", textAlign:"center", marginBottom:20 }}>
            <div style={{ fontSize:13, opacity:0.85 }}>Aapke Coins</div>
            <div style={{ fontSize:60, fontWeight:700 }}>{data.coins}</div>
            <div style={{ fontSize:14, opacity:0.9 }}>= {data.discount_percent}% discount agli ticket par</div>
          </div>

          <div style={{ background:"#f9f9f7", borderRadius:12, padding:16, marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>Coins kaise kamayein?</div>
            {[
              ["Bus mein check-in karo", "+10 coins"],
              ["Dosto ko refer karo", "+25 coins"],
              ["Route report karo", "+5 coins"],
            ].map(([action, reward]) => (
              <div key={action} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #eee", fontSize:14 }}>
                <span>{action}</span>
                <span style={{ color:"#1D9E75", fontWeight:600 }}>{reward}</span>
              </div>
            ))}
          </div>

          <div style={{ background:"#fff8e1", borderRadius:12, padding:16 }}>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:8 }}>Coins kahan use karein?</div>
            <div style={{ fontSize:13, color:"#666" }}>
              • 50 coins = 5% ticket discount<br/>
              • 100 coins = 10% discount<br/>
              • 200 coins = 20% discount<br/>
              • Max 50% discount (500 coins)
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign:"center", padding:40, color:"#999" }}>Loading...</div>
      )}
    </div>
  );
}
