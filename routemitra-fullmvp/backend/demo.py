"""
RouteMitra — Hackathon Demo Script
===================================
Run this for a LIVE terminal demo — no Twilio needed!
Shows judges exactly how the SMS bot works.

Usage:
  python demo.py

Or test specific messages:
  python demo.py "ETA BUS 4"
  python demo.py "ETA BUS 2 CIVIL LINES"
"""

import sys
import time
from sms_parser import parse_sms
from eta_engine import calculate_eta
from reply_generator import generate_reply
from data.routes import ROUTES

# ANSI colors
GREEN  = "\033[92m"
BLUE   = "\033[94m"
YELLOW = "\033[93m"
RESET  = "\033[0m"
BOLD   = "\033[1m"
DIM    = "\033[2m"


def box(title, content, color=BLUE):
    width = 50
    print(f"\n{color}{'─' * width}{RESET}")
    print(f"{color}{BOLD} {title}{RESET}")
    print(f"{color}{'─' * width}{RESET}")
    for line in content.split("\n"):
        print(f"  {line}")
    print(f"{color}{'─' * width}{RESET}")


def process_sms(message: str, sender: str = "+91-98765-XXXXX"):
    print(f"\n{DIM}{'=' * 50}{RESET}")
    print(f"📱 {YELLOW}Incoming SMS from {sender}{RESET}")
    print(f"   Message: {BOLD}\"{message}\"{RESET}")
    time.sleep(0.4)

    parsed = parse_sms(message)
    print(f"\n🔍 {DIM}Parser: command={parsed['command']}{RESET}")
    time.sleep(0.3)

    eta_data = None
    if parsed["command"] == "ETA":
        route_id = parsed["route_id"]
        route = ROUTES[route_id]
        stop = parsed["stop"] or route["stops"][0]
        print(f"⚙  {DIM}Calculating ETA for Bus {route_id} at {stop}...{RESET}")
        eta_data = calculate_eta(
            route_id=route_id,
            stops=route["stops"],
            user_stop=stop,
            frequency_min=route["frequency_min"],
        )
        time.sleep(0.5)

    reply = generate_reply(parsed, eta_data)
    box("📨 SMS Reply (sent via Twilio)", reply, GREEN)

    if eta_data and "error" not in eta_data:
        print(f"\n{DIM}  ETA Engine details:")
        print(f"  • Delay multiplier: {eta_data['delay_multiplier']}x")
        print(f"  • Delay reason: {eta_data['delay_reason']}{RESET}")


DEMO_MESSAGES = [
    ("ETA BUS 4",                "User jaanna chahta hai Bus 4 kab aayegi"),
    ("ETA BUS 2 CIVIL LINES",    "User Civil Lines stop ka ETA pooch raha hai"),
    ("BUS 5 MODEL TOWN",         "Alternate format — Bus 5 Model Town"),
    ("LIST",                     "Sabhi buses dekhni hain"),
    ("HELP",                     "Pehli baar user — commands chahiye"),
    ("ETA BUS 99",               "Invalid bus number — graceful error"),
    ("KAB AAYEGI BUS",           "Unknown format — graceful fallback"),
]


def run_full_demo():
    print(f"\n{BOLD}{'=' * 50}")
    print("  🚌 RouteMitra SMS Bot — Live Demo")
    print(f"     Ludhiana Public Transit")
    print(f"{'=' * 50}{RESET}")
    print(f"{DIM}  Simulating real SMS conversations...{RESET}\n")
    time.sleep(0.8)

    for msg, desc in DEMO_MESSAGES:
        print(f"\n{YELLOW}[ Scenario: {desc} ]{RESET}")
        process_sms(msg)
        time.sleep(0.6)

    print(f"\n{GREEN}{BOLD}✅ Demo complete!{RESET}")
    print(f"{DIM}In production: Twilio routes real SMS to POST /sms endpoint{RESET}\n")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Single message mode: python demo.py "ETA BUS 4"
        process_sms(" ".join(sys.argv[1:]))
    else:
        run_full_demo()
