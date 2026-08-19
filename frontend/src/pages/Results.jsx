import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Medal, Flame, Home } from "lucide-react";
import useUserStore from "../store/userStore";
import useGameStore from "../store/gameStore";

export default function Results() {
  const navigate = useNavigate();
  const { username, isHost } = useUserStore();
  const { leaderboard, score, streak, maxStreak, resetGame } = useGameStore();
  const [confetti, setConfetti] = useState([]);

  const myRank = leaderboard.findIndex((p) => p.username === username);
  const myData = leaderboard[myRank] || { score: 0, accuracy: 0, totalTime: 0, streakMax: 0 };
  const podium = leaderboard.slice(0, 3);

  useEffect(() => {
    const colors = ["#CDD4B1", "#EECCD0", "#DCA278", "#EBECCC", "#FFF9E2", "#EF4444"];
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      size: 6 + Math.random() * 8,
    }));
    setConfetti(pieces);
  }, []);

  return (
    <div className="screen">
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti"
          style={{
            left: `${c.left}%`,
            width: c.size,
            height: c.size,
            background: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        />
      ))}

      <motion.div
        className="glass-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}
        >
          <Trophy size={56} color="var(--gold)" />
        </motion.div>

        <h1>Quiz Complete!</h1>

        {podium.length >= 2 && (
          <div className="podium-container">
            {podium.length >= 2 && (
              <div className="podium-place">
                <div className="podium-name">{podium[1]?.username}</div>
                <div className="podium-score">{podium[1]?.score} pts</div>
                <motion.div
                  className="podium-bar silver"
                  initial={{ height: 0 }}
                  animate={{ height: 120 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Medal size={24} color="#B8AFA5" />
                </motion.div>
              </div>
            )}
            {podium.length >= 1 && (
              <div className="podium-place">
                <div className="podium-name">{podium[0]?.username}</div>
                <div className="podium-score">{podium[0]?.score} pts</div>
                <motion.div
                  className="podium-bar gold"
                  initial={{ height: 0 }}
                  animate={{ height: 160 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Medal size={28} color="#DCA278" />
                </motion.div>
              </div>
            )}
            {podium.length >= 3 && (
              <div className="podium-place">
                <div className="podium-name">{podium[2]?.username}</div>
                <div className="podium-score">{podium[2]?.score} pts</div>
                <motion.div
                  className="podium-bar bronze"
                  initial={{ height: 0 }}
                  animate={{ height: 90 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <Medal size={22} color="#CDD4B1" />
                </motion.div>
              </div>
            )}
          </div>
        )}

        <h3>Your Performance</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          <div className="stat-card">
            <div className="stat-label">Score</div>
            <div className="stat-value" style={{ color: "var(--accent-primary)" }}>{score}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Rank</div>
            <div className="stat-value" style={{ color: "var(--gold)" }}>
              #{myRank >= 0 ? myRank + 1 : "-"}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Accuracy</div>
            <div className="stat-value">{myData.accuracy || 0}%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Max Streak</div>
            <div className="stat-value" style={{ color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <Flame size={18} /> {maxStreak}
            </div>
          </div>
        </div>

        {leaderboard.length > 0 && (
          <>
            <h3>Final Standings</h3>
            <div style={{ marginTop: 8 }}>
              {leaderboard.map((p, i) => (
                <motion.div
                  className={`leaderboard-row ${i === myRank ? "rank-1" : ""}`}
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={p.username === username ? { border: "1px solid var(--accent-primary)" } : {}}
                >
                  <span className="leaderboard-rank">
                    {i === 0 ? <Medal size={18} color="#DCA278" /> : i === 1 ? <Medal size={18} color="#B8AFA5" /> : i === 2 ? <Medal size={18} color="#CDD4B1" /> : `#${i + 1}`}
                  </span>
                  <span className="leaderboard-name">
                    {p.username} {p.username === username ? "(You)" : ""}
                  </span>
                  <span className="leaderboard-score">{p.score}</span>
                </motion.div>
              ))}
            </div>
          </>
        )}

        <button
          className="btn-primary"
          onClick={() => {
            localStorage.removeItem("cincoquiz-session");
            resetGame();
            navigate("/");
          }}
          style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <Home size={18} /> Back to Home
        </button>
      </motion.div>
    </div>
  );
}
