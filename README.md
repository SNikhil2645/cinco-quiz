<div align="center">

# CincoQuiz

Real-Time Competitive Quiz Platform for CS Students

[![Live Demo](https://img.shields.io/badge/Live%20Demo-cinco--quiz.vercel.app-brightest)](https://cinco-quiz-nikhil2645.vercel.app)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF)](https://vite.dev)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101)](https://socket.io)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-9-47A248)](https://www.mongodb.com)

</div>

---

## About

CincoQuiz is a real-time multiplayer quiz platform where players compete head-to-head with timed questions, streak multipliers, power-ups, and live leaderboards — all synced via WebSockets. Built with a premium glassmorphism design system featuring a soft pastel palette and 3D decorative background.

## Features

- **Multiplayer Rooms** — Create or join with a 6-digit code, spectate live games
- **Single Player** — Solo practice with custom topic, difficulty, and timer
- **Streaks & Power-Ups** — Streak multiplier, 50/50, Double Points, Freeze Timer
- **Live Leaderboard** — Real-time scoring after every question
- **Results Podium** — Gold/silver/bronze, accuracy ring, stats, confetti
- **Glassmorphism UI** — Frosted glass cards with gradient border glow, cursor-following card highlight, backdrop blur
- **3D Decorative Background** — Glossy spheres, hexagons (filled + outline), dot-grid clusters, capsules, arcs, isometric cube — all precisely positioned
- **Responsive Design** — Mobile, tablet, desktop, landscape optimized

## Design System

### Background
- 135deg diagonal gradient: `#C9D3BA` → `#DCE0CC` → `#EFEADF` → `#F3E2D0`
- 26 static 3D decorative elements with glossy shading at 70-95% opacity
- Mesh gradient overlays via radial gradients

### Glass Cards
- White `rgba(255,255,255,0.60)` at 24px backdrop blur
- Gradient border: sage `#A8C090` → peach `#E8B088` at 30-40% opacity
- Shadow: `#000000` at 8-10% with soft diffuse blur
- Cursor-following border glow (CardGlow component)

### Typography
- Title gradient: sage `#6B8352` → `#7D9563` → terracotta `#C97D4E` → `#D4A574`
- Body text: `#8A8072`
- Labels: `#6B6558`

### Buttons
- Primary: gradient fill `#8FA377` → `#E0A874` → `#E5A987`, pill shape, white icon badge
- Secondary: frosted glass `rgba(255,255,255,0.45)`, border `#E5E0D4`, pill shape, semantic icon tinting

### Color Palette

| Role | Hex |
|------|-----|
| Eucalyptus | `#CDD4B1` |
| Pistachio | `#EBECCC` |
| Ivory | `#FFF9E2` |
| Peach | `#EECCD0` |
| Clay | `#DCA278` |
| Correct | `#22C55E` |
| Wrong | `#EF4444` |
| Gold | `#DCA278` |
| Silver | `#B8AFA5` |
| Bronze | `#CDD4B1` |

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 18, Vite 6, React Router, Framer Motion, Zustand |
| Backend | Node.js, Express 5, Socket.IO 4 |
| Database | MongoDB (Mongoose 9) |
| Deploy | Vercel (frontend), Render (backend) |

## Project Structure

```
cinco-quiz/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CardGlow.jsx          # Cursor-following border glow
│   │   │   ├── DecorativeBackground.jsx  # 26 static 3D background elements
│   │   │   └── ParticleBackground.jsx    # (legacy, unused)
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── ModeSelect.jsx        # Single/Multiplayer mode
│   │   │   ├── SinglePlayerSetup.jsx # Solo config
│   │   │   ├── CreateRoom.jsx        # Host room creation
│   │   │   ├── JoinRoom.jsx          # Player room join
│   │   │   ├── HostLobby.jsx         # Host waiting room
│   │   │   ├── PlayerLobby.jsx       # Player waiting room
│   │   │   ├── Quiz.jsx              # Core quiz gameplay
│   │   │   ├── Results.jsx           # Post-game results
│   │   │   └── ViewResults.jsx       # Past results lookup
│   │   ├── store/                    # Zustand state
│   │   ├── socket/                   # Socket.IO service
│   │   ├── App.jsx                   # Routes + background mounting
│   │   └── index.css                 # Full design system
│   └── ...
├── backend/
│   ├── server.js                     # Express + Socket.IO
│   ├── models/                       # Mongoose schemas
│   ├── routes/                       # REST API
│   └── seed/                         # Question seeder
└── ...
```

## Quick Start

```bash
git clone https://github.com/SNikhil2645/cinco-quiz.git
cd cinco-quiz
```

**Backend:**
```bash
cd backend && npm install
cp .env.example .env   # set MONGODB_URI, CLIENT_URL
node seed/seed.js
node server.js          # port 5000
```

**Frontend:**
```bash
cd frontend && npm install
npm run dev             # port 5173
```

**Root scripts:** `npm run dev:frontend`, `npm run dev:backend`, `npm run build`, `npm run seed`

## License

Private. All rights reserved.
