import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useUserStore from "../store/userStore";
import useGameStore from "../store/gameStore";
import socket from "../socket/service";

const TOPICS = [
  "DSA", "Operating Systems", "DBMS", "Computer Networks",
  "OOP", "Python", "Java", "Web Dev", "SQL", "Compiler Design"
];

export default function SinglePlayerSetup() {
  const navigate = useNavigate();
  const { setUsername } = useUserStore();
  const { resetGame } = useGameStore();
  const [form, setForm] = useState({
    username: "",
    topic: "DSA",
    difficulty: "Easy",
    questionCount: 5,
    timer: 15,
  });

  useEffect(() => {
    resetGame();
  }, []);

  const handleStart = () => {
    if (!form.username.trim()) return;
    setUsername(form.username.trim());
    socket.emit("start-singleplayer", {
      username: form.username.trim(),
      topic: form.topic,
      difficulty: form.difficulty,
      questionCount: form.questionCount,
      timer: form.timer,
    });
  };

  useEffect(() => {
    const handleSingleplayerStarted = (data) => {
      socket.emit("set-singleplayer-room", { roomCode: data.roomCode });
      navigate("/quiz");
    };
    socket.on("singleplayer-started", handleSingleplayerStarted);
    return () => socket.off("singleplayer-started", handleSingleplayerStarted);
  }, [navigate]);

  return (
    <div className="screen">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>🎯 Single Player</h1>
        <p>Challenge yourself with CS questions</p>

        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <label>Topic</label>
        <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
          {TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <label>Difficulty</label>
        <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <label>Number of Questions</label>
        <select value={form.questionCount} onChange={(e) => setForm({ ...form, questionCount: parseInt(e.target.value) })}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>

        <label>Timer Per Question (seconds)</label>
        <select value={form.timer} onChange={(e) => setForm({ ...form, timer: parseInt(e.target.value) })}>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>

        <button className="btn-primary" onClick={handleStart} style={{ marginTop: 20 }}>
          Start Quiz 🚀
        </button>

        <button onClick={() => navigate("/mode")} style={{ marginTop: 8, opacity: 0.6 }}>
          ← Back
        </button>
      </motion.div>
    </div>
  );
}
