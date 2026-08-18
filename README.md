<div align="center">

# CincoQuiz

**Real-Time Competitive Quiz Platform for CS Students**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-cinco--quiz.vercel.app-brightest)](https://cinco-quiz-nikhil2645.vercel.app)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF)](https://vite.dev)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101)](https://socket.io)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.x-47A248)](https://www.mongodb.com)

</div>

---

## Overview

CincoQuiz is a real-time multiplayer quiz platform built for Computer Science students. Players compete head-to-head answering timed questions, earning streaks, using power-ups, and climbing the leaderboard — all powered by WebSockets for instant synchronization.

## Features

- **Real-Time Multiplayer** — Create or join rooms with a 6-digit code. All players see questions simultaneously via Socket.IO.
- **Single Player Mode** — Practice solo with configurable topic, difficulty, question count, and timer.
- **Streak System** — Consecutive correct answers build a streak multiplier for bonus points.
- **Power-Ups** — Use 50/50 (eliminate two wrong answers), Double Points, and Skip during gameplay.
- **Live Leaderboard** — Scores update in real-time after every question.
- **Results & Podium** — Post-game podium with gold/silver/bronze, accuracy ring, stats breakdown, and confetti animation.
- **Spectator Mode** — Watch live games without participating.
- **Interactive Background** — Canvas-based particle system with cursor-following geometric shapes and parallax depth layers.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 6, React Router 7, Framer Motion 11, Zustand 5, Lucide Icons |
| Backend | Node.js, Express 5, Socket.IO 4 |
| Database | MongoDB (Mongoose 9) |
| Deployment | Frontend on Vercel, Backend on Render |

## Project Structure

```
CincoQuiz/
  frontend/
    src/
      components/
        ParticleBackground.jsx   # Canvas particle system with cursor interaction
      pages/
        Home.jsx                 # Landing page
        ModeSelect.jsx           # Game mode selection
        SinglePlayerSetup.jsx    # Solo game config
        CreateRoom.jsx           # Host creates multiplayer room
        JoinRoom.jsx             # Player joins via room code
        HostLobby.jsx            # Pre-game lobby (host)
        PlayerLobby.jsx          # Pre-game lobby (player)
        Quiz.jsx                 # Active gameplay
        Results.jsx              # Post-game results + podium
        ViewResults.jsx          # Historical results lookup
      store/
        gameStore.js             # Zustand: quiz state, scores, streaks, power-ups
        userStore.js             # Zustand: username, room code, host status
      socket/
        service.js               # Socket.IO client singleton
      App.jsx                    # Router + global particle background
      index.css                  # Full design system (CSS variables, glassmorphism)
  backend/
    server.js                    # Express + Socket.IO server
    config/db.js                 # MongoDB connection
    models/                      # Quiz, Result, Room schemas
    routes/                      # REST API endpoints
    socket/handler.js            # Real-time game logic
    seed/                        # Database seeder for quiz questions
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/SNikhil2645/cinco-quiz.git
cd cinco-quiz
```

**Backend:**

```bash
cd backend
npm install
cp .env.example .env    # Configure MONGODB_URI and CLIENT_URL
node seed/seed.js       # Seed quiz questions
node server.js          # Starts on port 5000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev             # Starts on port 5173
```

### Scripts (from root)

```bash
npm run dev:frontend    # Start frontend dev server
npm run dev:backend     # Start backend dev server
npm run build           # Build frontend for production
npm run seed            # Seed database
```

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Neutral | `#1a1716` | Background |
| Primary | `#bc8168` | Accent, buttons, brand |
| Iron | `#76ff4c` | Secondary accent, gradient endpoint |
| Success | `#b7f915` | Correct answers |
| Caution | `#edce2e` | Streaks, gold medals |
| Danger | `#ed1848` | Wrong answers, errors |
| Info | `#254fd7` | Links, info states |

## Environment Variables

**Backend** (`.env`):

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `CLIENT_URL` | Frontend URL for CORS |
| `PORT` | Server port (default: 5000) |

## License

Private project. All rights reserved.
