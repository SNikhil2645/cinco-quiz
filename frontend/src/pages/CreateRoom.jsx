import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Rocket, ArrowLeft } from "lucide-react";
import useUserStore from "../store/userStore";
import useGameStore from "../store/gameStore";
import socket from "../socket/service";

const TOPICS = [
  "DSA", "Operating Systems", "DBMS", "Computer Networks",
  "OOP", "Python", "Java", "Web Dev", "SQL", "Compiler Design",
  "Mixed (All Topics)"
];

export default function CreateRoom() {
  const navigate = useNavigate();
  const { setUsername, setIsHost, setRoomCode } = useUserStore();
  const { setPlayers } = useGameStore();
  const [hostName, setHostName] = useState("");
  const [settings, setSettings] = useState({
    topic: "Mixed (All Topics)",
    difficulty: "Easy",
    questionCount: 5,
    timer: 15,
    powerupsEnabled: true,
    isSpectating: false,
  });

  useEffect(() => {
    const handleRoomCreated = (data) => {
      setRoomCode(data.roomCode);
      setIsHost(true);
      setPlayers(data.players);
      localStorage.setItem("cincoquiz-session", JSON.stringify({ roomCode: data.roomCode, username: hostName.trim(), isHost: true, isSpectating: settings.isSpectating }));
      navigate("/host-lobby");
    };
    socket.on("room-created", handleRoomCreated);
    return () => socket.off("room-created", handleRoomCreated);
  }, [navigate]);

  const handleCreate = () => {
    if (!hostName.trim()) return;
    setUsername(hostName.trim());
    socket.emit("create-room", {
      hostName: hostName.trim(),
      settings,
    });
  };

  return (
    <div className="screen">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}><Home size={32} /> Create Room</h1>
        <p>Set up your quiz room as host</p>

        <label>Your Name (Host)</label>
        <input
          type="text"
          placeholder="Enter host name"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
        />

        <label>Topic</label>
        <select value={settings.topic} onChange={(e) => setSettings({ ...settings, topic: e.target.value })}>
          {TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <label>Difficulty</label>
        <select value={settings.difficulty} onChange={(e) => setSettings({ ...settings, difficulty: e.target.value })}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <label>Number of Questions</label>
        <select value={settings.questionCount} onChange={(e) => setSettings({ ...settings, questionCount: parseInt(e.target.value) })}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>

        <label>Timer Per Question (seconds)</label>
        <select value={settings.timer} onChange={(e) => setSettings({ ...settings, timer: parseInt(e.target.value) })}>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={settings.powerupsEnabled}
            onChange={(e) => setSettings({ ...settings, powerupsEnabled: e.target.checked })}
            style={{ width: "auto", marginTop: 0 }}
          />
          Enable Power-ups (50-50, Double Points, Freeze Timer)
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={settings.isSpectating}
            onChange={(e) => setSettings({ ...settings, isSpectating: e.target.checked })}
            style={{ width: "auto", marginTop: 0 }}
          />
          Spectate Mode (host only watches, doesn't play)
        </label>

        <button className="btn-primary" onClick={handleCreate} style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Rocket size={18} /> Create Room
        </button>

        <button onClick={() => navigate("/mode")} style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <ArrowLeft size={16} color="#6B6558" /> Back
        </button>
      </motion.div>
    </div>
  );
}
