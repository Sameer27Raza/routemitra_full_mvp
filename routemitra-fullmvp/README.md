# 🚌 RouteMitra — Full MVP

> AI-powered, offline-first public transit platform for Ludhiana

## What's Inside

```
routemitra-fullmvp/
├── backend/              # Python FastAPI server
│   ├── main.py           # All API routes + Twilio webhooks
│   ├── sms_parser.py     # SMS/WhatsApp message parser
│   ├── eta_engine.py     # AI delay prediction engine
│   ├── reply_generator.py # Bilingual SMS replies
│   ├── demo.py           # Hackathon demo script
│   └── data/routes.py    # Ludhiana bus routes DB
│
├── frontend/             # React PWA (user app)
│   ├── src/
│   │   ├── App.jsx           # Main app with routing
│   │   ├── pages/
│   │   │   ├── HomeScreen.jsx    # Bus list + live ETA
│   │   │   ├── RouteScreen.jsx   # Route detail + check-in
│   │   │   ├── CoinsScreen.jsx   # Transit Coins wallet
│   │   │   └── AdminScreen.jsx   # Heatmap + revenue dashboard
│   │   ├── components/
│   │   │   └── BottomNav.jsx     # Nav + offline banner
│   │   └── api.js            # API calls with offline cache
│   └── public/sw.js          # Service worker (offline PWA)
│
└── docker-compose.yml    # One-command full stack launch
```

---

## Option A — Quick Demo (No setup, judges ke liye best)

```bash
cd backend
pip install fastapi uvicorn python-dotenv
python demo.py          # SMS bot demo
python main.py          # Full API server at :8000
```

Then open: http://localhost:8000/docs

---

## Option B — Full Stack (React PWA + Backend)

### Step 1: Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env     # Fill Twilio keys (optional for demo)
python main.py
# → http://localhost:8000
```

### Step 2: Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Step 3 (Optional): Docker — sab ek saath
```bash
docker-compose up --build
# Backend:  http://localhost:8000
# Frontend: http://localhost:3000
# Redis:    localhost:6379
# Postgres: localhost:5432
```

---

## Twilio Setup (SMS + WhatsApp — 10 minutes)

1. Free account: https://twilio.com/try-twilio
2. Ek number lo (trial mein free)
3. `.env` fill karo:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxx
   TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
   ```
4. Webhook set karo (ngrok use karo for local):
   ```bash
   ngrok http 8000
   # Copy URL → Twilio console → SMS webhook: https://xxxx.ngrok.io/webhook/sms
   # WhatsApp sandbox: https://xxxx.ngrok.io/webhook/whatsapp
   ```
5. Ab real phone se SMS bhejo!

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/routes` | All Ludhiana routes |
| GET | `/api/eta/{id}?stop=X` | Live ETA for route |
| POST | `/api/checkin` | Passenger check-in → coins |
| GET | `/api/coins/{user_id}` | Coin balance |
| GET | `/api/admin/heatmap` | Stop demand data |
| GET | `/api/admin/revenue` | Revenue dashboard |
| POST | `/webhook/sms` | Twilio SMS webhook |
| POST | `/webhook/whatsapp` | Twilio WhatsApp webhook |

---

## SMS Commands

| SMS | Response |
|-----|----------|
| `ETA BUS 4` | Bus 4 ka ETA (first stop) |
| `ETA BUS 3 CIVIL LINES` | Civil Lines stop ka ETA |
| `LIST` | Sabhi Ludhiana buses |
| `HELP` | Commands list |

WhatsApp par apni location share karo → nearest bus milegi!

---

## Features Built

| Feature | Status |
|---------|--------|
| SMS Bot (Hinglish) | ✅ Done |
| WhatsApp Bot | ✅ Done |
| React PWA (offline) | ✅ Done |
| Live ETA (simulated GPS) | ✅ Done |
| Transit Coins system | ✅ Done |
| Admin heatmap | ✅ Done |
| Redis live GPS | ✅ Done (fallback included) |
| Docker deployment | ✅ Done |
| AI delay prediction | ✅ Done |

## Roadmap (Phase 3+)

- ₹300 ESP32 IoT board for buses (no phone needed)
- OpenWeatherMap real weather API
- Google Maps route overlay
- Municipality CSV export
- UPI payment integration for coin redemption

---

Built for Hackathon | Team RouteMitra | Ludhiana, Punjab 🚌
