import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useUserStore from "../store/userStore";
import useGameStore from "../store/gameStore";
import socket from "../socket/service";

export default function HostLobby() {
  const navigate = useNavigate();
  const { username, roomCode } = useUserStore();
  const { setPlayers, resetGame } = useGameStore();
  const [players, setPlayersLocal] = useState([]);
  const [copied, setCopied] = useState(false);

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

  const handleStartQuiz = () => {
    if (players.length < 1) return;
    socket.emit("start-quiz", { roomCode });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="screen">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>🏠 Host Lobby</h1>
        <p>Share this code with players to join</p>

        <div
          className="room-code-display"
          onClick={copyCode}
          style={{ cursor: "pointer" }}
          title="Click to copy"
        >
          {roomCode}
        </div>

        <p style={{ fontSize: 13, marginTop: -8 }}>
          {copied ? "✅ Copied!" : "Click code to copy"}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <h3 style={{ margin: 0 }}>Players ({players.length})</h3>
        </div>

        <div style={{ marginTop: 12 }}>
          {players.map((p, i) => (
            <div className="player-item" key={i}>
              <span>{i === 0 ? "👑" : "👤"} {p.username}</span>
              {i === 0 && <span className="host-badge">HOST</span>}
            </div>
          ))}
          {players.length === 0 && (
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Waiting for players to join...
            </p>
          )}
        </div>

        <button className="btn-primary" onClick={handleStartQuiz} disabled={players.length < 1} style={{ marginTop: 20 }}>
          Start Quiz ({players.length} player{players.length !== 1 ? "s" : ""}) 🎯
        </button>

        <button onClick={() => navigate("/")} className="btn-danger" style={{ marginTop: 8 }}>
          End Room
        </button>
      </motion.div>
    </div>
  );
}
