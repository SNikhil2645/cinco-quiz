import { io } from "socket.io-client";

const BACKEND_URL = "https://cinco-quiz-backend2.onrender.com";

const socket = io(BACKEND_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
  const saved = localStorage.getItem("cincoquiz-session");
  if (saved) {
    try {
      const { roomCode, username, isHost } = JSON.parse(saved);
      socket.emit("rejoin-room", { roomCode, username, isHost });
    } catch {
      localStorage.removeItem("cincoquiz-session");
    }
  }
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});

export default socket;
