import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useUserStore from "../store/userStore";
import useGameStore from "../store/gameStore";
import socket from "../socket/service";

export default function PlayerLobby() {
  const navigate = useNavigate();
  const { roomCode, username } = useUserStore();
  const { setPlayers, resetGame } = useGameStore();
  const [players, setPlayersLocal] = useState([]);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    const handlePlayerJoined = (data) => {
      setPlayersLocal(data.players);
      setPlayers(data.players);
    };

    const handleQuizStarted = (data) => {
      useGameStore.getState().setQuestion(
        data.question,
        data.questionIndex,
        data.totalQuestions
      );
      useGameStore.getState().timeLeft = data.timePerQuestion;
      navigate("/quiz");
    };

    socket.on("player-joined", handlePlayerJoined);
    socket.on("quiz-started", handleQuizStarted);
    return () => {
      socket.off("player-joined", handlePlayerJoined);
      socket.off("quiz-started", handleQuizStarted);
    };
  }, [navigate]);

  return (
    <div className="screen">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>⏳ Waiting Lobby</h1>
        <p>Waiting for host to start the quiz...</p>

        <div
          className="room-code-display"
          style={{ fontSize: 40, letterSpacing: 8, marginBottom: 16 }}
        >
          {roomCode}
        </div>

        <h3>Players ({players.length})</h3>
        <div style={{ marginTop: 12 }}>
          {players.map((p, i) => (
            <div className="player-item" key={i}>
              <span>
                {p.username === username ? "🎮 " : "👤 "}
                {p.username}
                {p.username === username ? " (You)" : ""}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 30, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            style={{ fontSize: 24 }}
          >
            ⏳
          </motion.div>
          <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>Waiting for host...</span>
        </div>
      </motion.div>
    </div>
  );
}
