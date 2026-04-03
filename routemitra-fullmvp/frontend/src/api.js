const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CACHE_KEY = "routemitra_cache";

function getCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); }
  catch { return {}; }
}
function setCache(key, data) {
  const c = getCache();
  c[key] = { data, ts: Date.now() };
  localStorage.setItem(CACHE_KEY, JSON.stringify(c));
}
function fromCache(key, maxAge = 300000) {
  const c = getCache();
  if (c[key] && Date.now() - c[key].ts < maxAge) return c[key].data;
  return null;
}

async function fetchWithFallback(path, cacheKey, maxAge) {
  try {
    const r = await fetch(`${BASE}${path}`);
    if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    setCache(cacheKey, data);
    return data;
  } catch {
    const cached = fromCache(cacheKey, maxAge);
    if (cached) return { ...cached, _offline: true };
    throw new Error("Offline aur cache empty hai");
  }
}

export async function getRoutes() {
  return fetchWithFallback("/api/routes", "routes", 3600000);
}

export async function getETA(routeId, stop) {
  const q = stop ? `?stop=${encodeURIComponent(stop)}` : "";
  return fetchWithFallback(`/api/eta/${routeId}${q}`, `eta_${routeId}`, 60000);
}

export async function checkin(routeId, stop, userId) {
  const r = await fetch(`${BASE}/api/checkin?route_id=${routeId}&stop=${encodeURIComponent(stop)}&user_id=${userId}`, {
    method: "POST",
  });
  return r.json();
}

export async function getCoins(userId) {
  return fetchWithFallback(`/api/coins/${userId}`, `coins_${userId}`, 30000);
}

export async function getHeatmap() {
  return fetchWithFallback("/api/admin/heatmap", "heatmap", 60000);
}

export async function getRevenue() {
  return fetchWithFallback("/api/admin/revenue", "revenue", 60000);
}
