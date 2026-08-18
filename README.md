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

CincoQuiz is a real-time multiplayer quiz platform where players compete head-to-head with timed questions, streak multipliers, power-ups, and live leaderboards — all synced via WebSockets.

## Features

- **Multiplayer Rooms** — Create or join with a 6-digit code, spectate live games
- **Single Player** — Solo practice with custom topic, difficulty, and timer
- **Streaks & Power-Ups** — Streak multiplier, 50/50, Double Points, Skip
- **Live Leaderboard** — Real-time scoring after every question
- **Results Podium** — Gold/silver/bronze, accuracy ring, stats, confetti
- **Interactive Background** — Canvas particles with cursor-following geometry

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 18, Vite 6, React Router, Framer Motion, Zustand |
| Backend | Node.js, Express 5, Socket.IO 4 |
| Database | MongoDB (Mongoose 9) |
| Deploy | Vercel (frontend), Render (backend) |

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

## Color Palette

| Role | Hex |
|------|-----|
| Neutral (bg) | `#1a1716` |
| Primary | `#bc8168` |
| Iron | `#76ff4c` |
| Success | `#b7f915` |
| Caution | `#edce2e` |
| Danger | `#ed1848` |
| Info | `#254fd7` |

## License

Private. All rights reserved.
