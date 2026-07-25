import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useUserStore from "../store/userStore";
import useGameStore from "../store/gameStore";
import socket from "../socket/service";

export default function HostLobby() {
  const navigate = useNavigate();
  const { username, roomCode, setRoomCode, setIsSpectating } = useUserStore();
  const { setPlayers, resetGame, players: storePlayers } = useGameStore();
  const [players, setPlayersLocal] = useState(storePlayers);
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
      if (data?.isSpectating) {
        setIsSpectating(true);
      }
      navigate("/quiz");
    };

    const handleRejoined = (data) => {
      if (data.isSpectating) {
        setIsSpectating(true);
      }
      if (data.status === "active") {
        navigate("/quiz");
        return;
      }
      if (data.roomCode) setRoomCode(data.roomCode);
      if (data.players) {
        setPlayersLocal(data.players);
        setPlayers(data.players);
      }
    };

    socket.on("player-joined", handlePlayerJoined);
    socket.on("quiz-started", handleQuizStarted);
    socket.on("rejoined", handleRejoined);
    return () => {
      socket.off("player-joined", handlePlayerJoined);
      socket.off("quiz-started", handleQuizStarted);
      socket.off("rejoined", handleRejoined);
    };
  }, [navigate]);

  const handleStartQuiz = () => {
    socket.emit("start-quiz", { roomCode });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hostPlayer = players.find((p) => p.isHost);
  const isSpectating = hostPlayer?.isSpectating || false;
  const activePlayers = players.filter((p) => !p.isSpectating);

  return (
    <div className="screen">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1>🏠 Host Lobby</h1>
        <p>Share this code with players to join</p>

        {isSpectating && (
          <div style={{
            padding: "8px 16px",
            borderRadius: 10,
            background: "rgba(226, 137, 90, 0.1)",
            border: "1px solid rgba(226, 137, 90, 0.25)",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 12,
            color: "var(--accent-primary)",
          }}>
            🎥 Spectate Mode — You will watch, not play
          </div>
        )}

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
          <h3 style={{ margin: 0 }}>Players ({activePlayers.length} playing{isSpectating ? ", 1 spectating" : ""})</h3>
        </div>

        <div style={{ marginTop: 12 }}>
          {players.map((p, i) => (
            <div className="player-item" key={i}>
              <span>{p.isHost ? "👑 " : "👤 "}{p.username}</span>
              {p.isHost && p.isSpectating && <span style={{ fontSize: 11, color: "var(--accent-primary)" }}>🎥 SPECTATING</span>}
              {p.isHost && !p.isSpectating && <span className="host-badge">HOST</span>}
            </div>
          ))}
          {players.length === 0 && (
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Waiting for players to join...
            </p>
          )}
        </div>

        <button className="btn-primary" onClick={handleStartQuiz} disabled={activePlayers.length < 1} style={{ marginTop: 20 }}>
          Start Quiz ({activePlayers.length} player{activePlayers.length !== 1 ? "s" : ""}) 🎯
        </button>

        <button onClick={() => { localStorage.removeItem("cincoquiz-session"); navigate("/"); }} className="btn-danger" style={{ marginTop: 8 }}>
          End Room
        </button>
      </motion.div>
    </div>
  );
}
