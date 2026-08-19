<p align="center">
  <img src="https://img.shields.io/badge/Live%20Demo-live-cincoquiz?style=for-the-badge&labelColor=23272F&color=8FA377" alt="Live Demo" />
</p>

<h1 align="center">
  <code>CincoQuiz</code>
</h1>

<p align="center">
  <strong>Real-Time Competitive Quiz Platform for CS Students</strong><br/>
  <sub>Head-to-head multiplayer quizzes with streaks, power-ups, and live leaderboards — built on WebSockets.</sub>
</p>

<p align="center">
  <a href="https://cinco-quiz-nikhil2645.vercel.app"><img src="https://img.shields.io/badge/Vercel-deployed-000000?style=flat-square&logo=vercel" alt="Vercel" /></a>
  <a href="https://github.com/SNikhil2645/cinco-quiz"><img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" /></a>
  <a href="https://github.com/SNikhil2645/cinco-quiz"><img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite" alt="Vite" /></a>
  <a href="https://github.com/SNikhil2645/cinco-quiz"><img src="https://img.shields.io/badge/Socket.IO-4-010101?style=flat-square&logo=socket.io&logoColor=white" alt="Socket.IO" /></a>
  <a href="https://github.com/SNikhil2645/cinco-quiz"><img src="https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
  <a href="https://github.com/SNikhil2645/cinco-quiz"><img src="https://img.shields.io/badge/MongoDB-9-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
</p>

---

## Overview

CincoQuiz is a real-time multiplayer quiz platform where players compete head-to-head with timed questions, streak multipliers, power-ups, and live leaderboards — all synced via WebSockets. The UI is built on a custom glassmorphism design system with a premium pastel palette, cursor-following card glow, and a 3D decorative background.

---

## Features

| Feature | Description |
|---------|-------------|
| **Multiplayer Rooms** | Create or join via 6-digit code, spectate live games |
| **Single Player** | Solo practice with custom topic, difficulty, and timer |
| **Streaks & Multipliers** | Consecutive correct answers increase point value |
| **Power-Ups** | 50/50, Double Points, Freeze Timer — one use per game |
| **Live Leaderboard** | Real-time scoring updated after every question |
| **Results Podium** | Gold/silver/bronze podium, accuracy ring, stats, confetti |
| **Reconnection** | Automatic rejoin on disconnect mid-game |
| **Past Results** | Look up any completed game by room code |

---

## Design System

### Palette

| Token | Name | Hex |
|-------|------|-----|
| `--eucalyptus` | Sage green | `#CDD4B1` |
| `--pistachio` | Soft lime | `#EBECCC` |
| `--ivory` | Warm white | `#FFF9E2` |
| `--peach` | Blush pink | `#EECCD0` |
| `--clay` | Terracotta | `#DCA278` |

### Background

135° diagonal gradient (`#C9D3BA` → `#DCE0CC` → `#EFEADF` → `#F3E2D0`) with 26 precisely positioned static 3D decorative elements: glossy spheres with radial highlight shading, filled and outlined hexagons, dot-grid clusters in all four corners, capsules, curved arcs, and an isometric cube with three distinct shaded faces.

### Glass Cards

White at 60% opacity with 24px backdrop blur. Gradient border from sage (`#A8C090`) to peach (`#E8B088`). Diffuse black shadow at 8–10% opacity. Cursor-following border glow via the `CardGlow` component using CSS custom properties (`--glow-x`, `--glow-y`, `--glow-opacity`).

### Typography

Titles use a four-stop gradient: deep sage (`#6B8352`) → leaf (`#7D9563`) → terracotta (`#C97D4E`) → warm clay (`#D4A574`). Body text is `#8A8072`, labels are `#6B6558`.

### Buttons

**Primary** — Gradient fill (`#8FA377` → `#E0A874` → `#E5A987`), pill shape, white circular icon badge. **Secondary** — Frosted glass at 45% opacity, `#E5E0D4` border, pill shape, semantically tinted icons (sage, clay, label colors).

---

## Tech Stack

```
Frontend   React 18 · Vite 6 · React Router 7 · Framer Motion · Zustand
Backend    Node.js 22 · Express 5 · Socket.IO 4
Database   MongoDB 9 (Mongoose)
Deploy     Vercel (frontend) · Render (backend)
```

---

## Project Structure

```
cinco-quiz/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── CardGlow.jsx              Cursor-following border glow
│       │   └── DecorativeBackground.jsx   26 static 3D background elements
│       ├── pages/
│       │   ├── Home.jsx                   Landing page
│       │   ├── ModeSelect.jsx             Single / Multiplayer choice
│       │   ├── SinglePlayerSetup.jsx      Solo game config
│       │   ├── CreateRoom.jsx             Host room creation
│       │   ├── JoinRoom.jsx               Player room join
│       │   ├── HostLobby.jsx              Host waiting room
│       │   ├── PlayerLobby.jsx            Player waiting room
│       │   ├── Quiz.jsx                   Core gameplay
│       │   ├── Results.jsx                Post-game results & podium
│       │   └── ViewResults.jsx            Past results lookup
│       ├── store/                         Zustand state management
│       ├── socket/                        Socket.IO service layer
│       ├── App.jsx                        Routes + background mounting
│       └── index.css                      Full design system (998 lines)
│
├── backend/
│   ├── server.js                          Express + Socket.IO bootstrap
│   ├── models/                            Mongoose schemas
│   ├── routes/                            REST API endpoints
│   └── seed/                              Question database seeder
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- MongoDB instance (local or Atlas)

### Clone

```bash
git clone https://github.com/SNikhil2645/cinco-quiz.git
cd cinco-quiz
```

### Backend

```bash
cd backend
npm install
cp .env.example .env          # set MONGODB_URI and CLIENT_URL
node seed/seed.js              # populate question bank
node server.js                 # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                    # http://localhost:5173
```

### Root Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev:frontend` | Start frontend only |
| `npm run dev:backend` | Start backend only |
| `npm run build` | Production build |
| `npm run seed` | Re-seed questions |

---

## Environment Variables

### Backend (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `PORT` | Server port (default 5000) | `5000` |

---

## License

Private — All rights reserved.
