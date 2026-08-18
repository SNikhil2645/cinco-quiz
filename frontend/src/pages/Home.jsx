import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Zap, Users, BarChart3 } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}
        >
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            background: "linear-gradient(135deg, #a855f7, #e2895a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 28px rgba(168, 85, 247, 0.30), 0 2px 8px rgba(226, 137, 90, 0.20)",
            position: "relative",
          }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path
                d="M22 4C12.06 4 4 12.06 4 22s8.06 18 18 18 18-8.06 18-18S31.94 4 22 4z"
                fill="none"
              />
              <path
                d="M17 15.5C17 12.46 19.46 10 22.5 10H24c2.76 0 5 2.24 5 5s-2.24 5-5 5h-1.5c-1.38 0-2.5 1.12-2.5 2.5V28"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="22" cy="33" r="2" fill="white" />
            </svg>
          </div>
        </motion.div>

        <h1 style={{ marginTop: 4 }}>CincoQuiz</h1>
        <p>Real-Time Competitive Quiz Platform for CS Students</p>

        <div style={{ display: "flex", gap: 16, margin: "20px 0", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
            <Zap size={16} color="var(--accent-primary)" />
            <span>Real-Time</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
            <Users size={16} color="var(--accent-primary)" />
            <span>Multiplayer</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
            <Trophy size={16} color="var(--accent-primary)" />
            <span>Competitive</span>
          </div>
        </div>

        <button className="btn-primary" onClick={() => navigate("/mode")} style={{ marginTop: 20 }}>
          Play Now
        </button>

        <button onClick={() => navigate("/view-results")} style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <BarChart3 size={16} /> View Past Results
        </button>
      </motion.div>
    </div>
  );
}
