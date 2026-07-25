import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useUserStore from "../store/userStore";
import useGameStore from "../store/gameStore";
import socket from "../socket/service";

export default function JoinRoom() {
  const navigate = useNavigate();
  const { setUsername, setRoomCode, setIsHost } = useUserStore();
  const { setPlayers } = useGameStore();
  const [username, setUsernameLocal] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handlePlayerJoined = (data) => {
      setPlayers(data.players);
      setIsHost(false);
      localStorage.setItem("cincoquiz-session", JSON.stringify({ roomCode: code.trim(), username: username.trim(), isHost: false }));
      navigate("/player-lobby");
    };
    const handleRoomError = (msg) => {
      setError(msg);
    };
    socket.on("player-joined", handlePlayerJoined);
    socket.on("room-error", handleRoomError);
    return () => {
      socket.off("player-joined", handlePlayerJoined);
      socket.off("room-error", handleRoomError);
    };
  }, [navigate]);

  const handleJoin = () => {
    setError("");
    if (!username.trim()) return;
    if (!code.trim() || code.trim().length !== 6) {
      setError("Enter a valid 6-digit room code");
      return;
    }
    setUsername(username.trim());
    setRoomCode(code.trim());
    socket.emit("join-room", {
      username: username.trim(),
      roomCode: code.trim(),
    });
  };

  return (
    <div className="screen">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1>🌍 Join Room</h1>
        <p>Enter the room code from your host</p>

        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsernameLocal(e.target.value)}
        />

        <label>Room Code</label>
        <input
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
          style={{ letterSpacing: 8, textAlign: "center", fontSize: 24, fontWeight: 700 }}
        />

        {error && (
          <p style={{ color: "var(--wrong-red)", marginTop: 12, fontSize: 14 }}>
            {error}
          </p>
        )}

        <button className="btn-primary" onClick={handleJoin} style={{ marginTop: 20 }}>
          Join Quiz 🚀
        </button>

        <button onClick={() => navigate("/mode")} style={{ marginTop: 8, opacity: 0.6 }}>
          ← Back
        </button>
      </motion.div>
    </div>
  );
}
