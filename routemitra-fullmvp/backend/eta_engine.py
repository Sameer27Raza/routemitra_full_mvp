"""
RouteMitra — ETA Engine
Simulates live bus location + calculates ETA with delay factors.
For demo: uses time-based simulation (no real GPS needed).
"""

import random
from datetime import datetime, time as dtime


# ---------------------------------------------------------------------------
# Simulated "live" bus position
# ---------------------------------------------------------------------------

def get_simulated_bus_position(route_id: str, stops: list[str]) -> dict:
    """
    Returns simulated current bus position between two stops.
    In production: this reads from Redis (live GPS crowdsourced data).
    """
    now = datetime.now()
    # Seed by minute so position is stable within the same minute
    seed = int(now.strftime("%H%M")) + hash(route_id) % 100
    random.seed(seed)

    current_stop_idx = random.randint(0, len(stops) - 2)
    progress_pct = random.randint(10, 90)  # % from current stop to next

    return {
        "current_stop": stops[current_stop_idx],
        "next_stop": stops[current_stop_idx + 1],
        "progress_pct": progress_pct,
    }


# ---------------------------------------------------------------------------
# Delay factors
# ---------------------------------------------------------------------------

PEAK_HOURS = [
    (dtime(8, 0), dtime(10, 0)),   # Morning rush
    (dtime(17, 0), dtime(20, 0)),  # Evening rush
]

def get_delay_multiplier() -> tuple[float, str]:
    """
    Returns (delay_multiplier, reason_string).
    Simulates weather + traffic + local events.
    In production: calls Weather API + checks local event calendar.
    """
    now = datetime.now()
    current_time = now.time()

    multiplier = 1.0
    reasons = []

    # Peak hour traffic
    for start, end in PEAK_HOURS:
        if start <= current_time <= end:
            multiplier += 0.3
            reasons.append("peak hour traffic")
            break

    # Simulated weather (in production: OpenWeatherMap API)
    # Demo: randomly simulate rain ~20% of the time
    random.seed(int(now.strftime("%Y%m%d%H")))  # stable per hour
    weather_roll = random.random()
    if weather_roll < 0.2:
        multiplier += 0.25
        reasons.append("barish (rain delay)")
    elif weather_roll < 0.35:
        multiplier += 0.1
        reasons.append("cloudy roads")

    # Simulated local event (mela/mandi — Saturdays)
    if now.weekday() == 5:  # Saturday
        multiplier += 0.2
        reasons.append("Saturday mandi traffic")

    reason_str = ", ".join(reasons) if reasons else "clear roads"
    return round(multiplier, 2), reason_str


# ---------------------------------------------------------------------------
# ETA Calculation
# ---------------------------------------------------------------------------

def calculate_eta(
    route_id: str,
    stops: list[str],
    user_stop: str,
    frequency_min: int,
) -> dict:
    """
    Main ETA function.
    Returns structured dict with ETA, stop info, and delay reason.
    """
    position = get_simulated_bus_position(route_id, stops)
    delay_mult, delay_reason = get_delay_multiplier()

    # Find user stop index
    user_idx = next(
        (i for i, s in enumerate(stops) if s.lower() == user_stop.lower()),
        None
    )

    if user_idx is None:
        return {"error": f"Stop '{user_stop}' not found on this route."}

    current_idx = stops.index(position["current_stop"])

    if user_idx <= current_idx:
        # Bus already passed — next cycle
        stops_remaining = (len(stops) - current_idx) + user_idx
        base_minutes = frequency_min + (stops_remaining * 4)
        note = "Agle bus ka wait karo"
    else:
        stops_remaining = user_idx - current_idx
        base_minutes = (stops_remaining * 4) - int(position["progress_pct"] / 25)
        base_minutes = max(1, base_minutes)
        note = "Bus aa rahi hai"

    eta_minutes = max(1, int(base_minutes * delay_mult))

    return {
        "eta_minutes": eta_minutes,
        "current_stop": position["current_stop"],
        "next_stop": position["next_stop"],
        "user_stop": user_stop,
        "delay_reason": delay_reason,
        "note": note,
        "delay_multiplier": delay_mult,
    }
