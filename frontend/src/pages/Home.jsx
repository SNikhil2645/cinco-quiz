import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Zap, Users } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{ fontSize: 64, marginBottom: 8 }}
        >
          🚀
        </motion.div>

        <h1>CincoQuiz</h1>
        <p>Real-Time Competitive Quiz Platform for CS Students</p>

        <div style={{ display: "flex", gap: 16, margin: "20px 0", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
            <Zap size={16} color="var(--accent-cyan)" />
            <span>Real-Time</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
            <Users size={16} color="var(--accent-cyan)" />
            <span>Multiplayer</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
            <Trophy size={16} color="var(--accent-cyan)" />
            <span>Competitive</span>
          </div>
        </div>

        <button className="btn-primary" onClick={() => navigate("/mode")} style={{ marginTop: 20 }}>
          Play Now 🚀
        </button>

        <button onClick={() => navigate("/view-results")} style={{ marginTop: 8 }}>
          📊 View Past Results
        </button>
      </motion.div>
    </div>
  );
}
