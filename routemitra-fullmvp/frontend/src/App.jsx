import { useState, useEffect } from "react";
import HomeScreen from "./pages/HomeScreen";
import RouteScreen from "./pages/RouteScreen";
import CoinsScreen from "./pages/CoinsScreen";
import AdminScreen from "./pages/AdminScreen";
import { BottomNav, OfflineBanner } from "./components/BottomNav";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const onOnline  = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online",  onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online",  onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const goToRoute = (routeId) => {
    setSelectedRoute(routeId);
    setPage("route");
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#fff", position: "relative", paddingBottom: 72 }}>
      <OfflineBanner isOnline={isOnline} />

      {page === "home"  && <HomeScreen onSelectRoute={goToRoute} />}
      {page === "route" && <RouteScreen routeId={selectedRoute} onBack={() => setPage("home")} />}
      {page === "coins" && <CoinsScreen />}
      {page === "admin" && <AdminScreen />}

      <BottomNav current={page} onChange={setPage} />
    </div>
  );
}
