"""
RouteMitra — SMS Parser
Parses incoming SMS in Hinglish/Hindi/English.

Supported formats:
  ETA BUS 4
  ETA BUS 4 DUGRI
  BUS 4
  ROUTE 4
  HELP
  LIST
"""

import re
from data.routes import ROUTES, STOP_ALIASES


def normalize(text: str) -> str:
    return text.strip().upper()


def resolve_stop(raw: str) -> str | None:
    """Resolve user's stop name to canonical stop name."""
    lower = raw.strip().lower()
    if lower in STOP_ALIASES:
        return STOP_ALIASES[lower]
    # Partial match
    for alias, canonical in STOP_ALIASES.items():
        if alias in lower or lower in alias:
            return canonical
    # Direct match against all stops
    for route in ROUTES.values():
        for stop in route["stops"]:
            if lower in stop.lower():
                return stop
    return None


def parse_sms(message: str) -> dict:
    """
    Parse incoming SMS.
    Returns:
      { "command": "ETA", "route_id": "4", "stop": "Dugri Phase 2" }
      { "command": "HELP" }
      { "command": "LIST" }
      { "command": "UNKNOWN", "raw": "..." }
    """
    text = normalize(message)

    # HELP
    if text in ("HELP", "MADAD", "?", "HI", "HELLO"):
        return {"command": "HELP"}

    # LIST all routes
    if text in ("LIST", "ROUTES", "BUSES", "BUS LIST", "SABHI BUS"):
        return {"command": "LIST"}

    # ETA BUS <N> [STOP]
    # Patterns: "ETA BUS 4", "ETA 4", "BUS 4 DUGRI", "ROUTE 4"
    patterns = [
        r"(?:ETA\s+)?(?:BUS|ROUTE|AUTO)\s*(\w+)\s*(.*)",
        r"ETA\s+(\w+)\s*(.*)",
    ]

    for pattern in patterns:
        m = re.match(pattern, text)
        if m:
            route_id = m.group(1).strip()
            stop_raw = m.group(2).strip() if m.lastindex >= 2 else ""

            if route_id not in ROUTES:
                return {
                    "command": "ROUTE_NOT_FOUND",
                    "route_id": route_id,
                }

            stop = None
            if stop_raw:
                stop = resolve_stop(stop_raw)
                if not stop:
                    return {
                        "command": "STOP_NOT_FOUND",
                        "route_id": route_id,
                        "raw_stop": stop_raw,
                    }

            return {
                "command": "ETA",
                "route_id": route_id,
                "stop": stop,  # None = use first stop
            }

    return {"command": "UNKNOWN", "raw": message}
