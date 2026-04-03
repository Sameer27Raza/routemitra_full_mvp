"""
RouteMitra — Reply Generator
Crafts bilingual (Hinglish) SMS replies.
Kept under 160 chars where possible (1 SMS unit).
"""

from data.routes import ROUTES


def reply_eta(eta_data: dict, route_id: str, route_name: str) -> str:
    eta = eta_data["eta_minutes"]
    stop = eta_data["user_stop"]
    current = eta_data["current_stop"]
    reason = eta_data["delay_reason"]
    note = eta_data["note"]

    # Short stop name for SMS
    short_stop = stop.split(",")[0]
    short_current = current.split(",")[0]

    lines = [
        f"🚌 RouteMitra",
        f"Bus {route_id} — {short_stop}",
        f"ETA: ~{eta} min ({note})",
        f"Abhi: {short_current}",
    ]
    if reason != "clear roads":
        lines.append(f"⚠ {reason}")
    lines.append("Reply HELP for commands")

    return "\n".join(lines)


def reply_help() -> str:
    return (
        "🚌 RouteMitra Commands:\n"
        "ETA BUS 4 — Bus 4 ki ETA\n"
        "ETA BUS 4 DUGRI — Dugri stop ka ETA\n"
        "LIST — Sabhi buses\n"
        "BUS 4 — Same as ETA BUS 4\n"
        "\nFree service. Powered by RouteMitra."
    )


def reply_list() -> str:
    lines = ["🚌 Ludhiana Buses:"]
    for route_id, info in ROUTES.items():
        first = info["stops"][0].split(" ")[0]
        last = info["stops"][-1].split(" ")[0]
        lines.append(f"Bus {route_id}: {first}→{last} (har {info['frequency_min']}min)")
    lines.append("\nETA BUS <number> bhejo")
    return "\n".join(lines)


def reply_route_not_found(route_id: str) -> str:
    valid = ", ".join(ROUTES.keys())
    return (
        f"Bus {route_id} nahi mili.\n"
        f"Available: {valid}\n"
        "LIST bhejo sabhi dekhne ke liye."
    )


def reply_stop_not_found(route_id: str, raw_stop: str) -> str:
    stops = ROUTES[route_id]["stops"]
    stop_list = ", ".join(s.split(",")[0] for s in stops)
    return (
        f"Stop '{raw_stop}' nahi mili Bus {route_id} par.\n"
        f"Stops: {stop_list}\n"
        "Dobara try karo."
    )


def reply_unknown(raw: str) -> str:
    return (
        f"'{raw[:20]}' samajh nahi aaya.\n"
        "HELP bhejo commands ke liye.\n"
        "Example: ETA BUS 4"
    )


def generate_reply(parsed: dict, eta_data: dict | None = None) -> str:
    cmd = parsed["command"]

    if cmd == "ETA" and eta_data:
        if "error" in eta_data:
            return f"Error: {eta_data['error']}"
        route_id = parsed["route_id"]
        route_name = ROUTES[route_id]["name"]
        return reply_eta(eta_data, route_id, route_name)

    elif cmd == "HELP":
        return reply_help()

    elif cmd == "LIST":
        return reply_list()

    elif cmd == "ROUTE_NOT_FOUND":
        return reply_route_not_found(parsed["route_id"])

    elif cmd == "STOP_NOT_FOUND":
        return reply_stop_not_found(parsed["route_id"], parsed["raw_stop"])

    else:
        return reply_unknown(parsed.get("raw", "?"))
