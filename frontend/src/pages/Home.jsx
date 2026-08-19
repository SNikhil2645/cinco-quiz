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
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#CDD4B1" />
                <stop offset="100%" stopColor="#DCA278" />
              </linearGradient>
            </defs>
            <path
              d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8z"
              fill="url(#logoGrad)"
              opacity="0.12"
            />
            <path
              d="M24 23c0-4.97 4.03-9 9-9h2c4.42 0 8 3.58 8 8s-3.58 8-8 8h-2c-2.21 0-4 1.79-4 4v6"
              stroke="url(#logoGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="32" cy="49" r="2.5" fill="url(#logoGrad)" />
          </svg>
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
