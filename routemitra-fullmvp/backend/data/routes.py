# RouteMitra — Ludhiana Bus Routes Database
# Real Ludhiana city routes (simulated ETA data for demo)

ROUTES = {
    "1": {
        "name": "Bus 1 — Ludhiana Railway Station → Ghumar Mandi",
        "stops": [
            "Ludhiana Railway Station",
            "Clock Tower",
            "Feroze Gandhi Market",
            "Chaura Bazar",
            "Ghumar Mandi",
        ],
        "frequency_min": 15,  # every 15 minutes
    },
    "2": {
        "name": "Bus 2 — Sarabha Nagar → Bus Stand",
        "stops": [
            "Sarabha Nagar",
            "BRS Nagar",
            "Gill Road",
            "Focal Point",
            "Ludhiana Bus Stand",
        ],
        "frequency_min": 20,
    },
    "3": {
        "name": "Bus 3 — Dugri → Civil Lines",
        "stops": [
            "Dugri Phase 2",
            "Dugri Phase 1",
            "Sherpur Chowk",
            "PAU Gate",
            "Civil Lines",
        ],
        "frequency_min": 25,
    },
    "4": {
        "name": "Bus 4 — Pakhowal Road → Sahnewal",
        "stops": [
            "Pakhowal Road",
            "Haibowal",
            "Shimlapuri",
            "Dhandari Kalan",
            "Sahnewal",
        ],
        "frequency_min": 30,
    },
    "5": {
        "name": "Bus 5 — Model Town → Jagraon Bridge",
        "stops": [
            "Model Town",
            "Gurdev Nagar",
            "Bhai Randhir Singh Nagar",
            "Lal Bagh",
            "Jagraon Bridge",
        ],
        "frequency_min": 20,
    },
    "AUTO1": {
        "name": "Auto Route — Raikot Road → Vegetable Market",
        "stops": [
            "Raikot Road Chowk",
            "Tibba Road",
            "Subzi Mandi",
        ],
        "frequency_min": 10,
    },
}

# Stop aliases — user shorthand → canonical stop name
STOP_ALIASES = {
    "station": "Ludhiana Railway Station",
    "railway": "Ludhiana Railway Station",
    "clock tower": "Clock Tower",
    "bus stand": "Ludhiana Bus Stand",
    "pau": "PAU Gate",
    "model town": "Model Town",
    "dugri": "Dugri Phase 2",
    "sarabha": "Sarabha Nagar",
    "civil lines": "Civil Lines",
    "ghumar mandi": "Ghumar Mandi",
    "sahnewal": "Sahnewal",
}
