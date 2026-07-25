import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Gamepad2, User } from "lucide-react";
import useUserStore from "../store/userStore";
import useGameStore from "../store/gameStore";
import socket from "../socket/service";

export default function PlayerLobby() {
  const navigate = useNavigate();
  const { roomCode, username, setIsHost, setRoomCode: setRoomCodeUser } = useUserStore();
  const { setPlayers, resetGame, players: storePlayers } = useGameStore();
  const [players, setPlayersLocal] = useState(storePlayers);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    const handlePlayerJoined = (data) => {
      setPlayersLocal(data.players);
      setPlayers(data.players);
    };

    const handleQuizStarted = () => {
      navigate("/quiz");
    };

    const handleRejoined = (data) => {
      if (data.status === "active") {
        navigate("/quiz");
        return;
      }
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

  return (
    <div className="screen">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}><Clock size={32} /> Waiting Lobby</h1>
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
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {p.username === username ? <Gamepad2 size={15} color="var(--accent-primary)" /> : <User size={15} />}
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
            style={{ display: "flex" }}
          >
            <Clock size={22} color="var(--text-secondary)" />
          </motion.div>
          <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>Waiting for host...</span>
        </div>
      </motion.div>
    </div>
  );
}
