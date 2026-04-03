// BottomNav.jsx
export function BottomNav({ current, onChange }) {
  const tabs = [
    { id:"home",  icon:"🚌", label:"Buses" },
    { id:"coins", icon:"🪙", label:"Coins" },
    { id:"admin", icon:"📊", label:"Admin" },
  ];
  return (
    <div style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:480, background:"#fff",
      borderTop:"1px solid #eee", display:"flex", zIndex:100
    }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            flex:1, padding:"10px 0 12px", border:"none", background:"transparent",
            cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2,
            color: current===t.id ? "#1D9E75" : "#999",
            borderTop: current===t.id ? "2px solid #1D9E75" : "2px solid transparent",
          }}
        >
          <span style={{ fontSize:20 }}>{t.icon}</span>
          <span style={{ fontSize:11, fontWeight: current===t.id?600:400 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// OfflineBanner.jsx
export function OfflineBanner({ isOnline }) {
  if (isOnline) return null;
  return (
    <div style={{
      background:"#FF6B35", color:"#fff", textAlign:"center",
      padding:"8px", fontSize:13, fontWeight:500
    }}>
      📡 Offline mode — cached data dikh raha hai • SMS: ETA BUS 4
    </div>
  );
}

export default BottomNav;
