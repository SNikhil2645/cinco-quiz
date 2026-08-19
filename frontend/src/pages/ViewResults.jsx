import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Medal, ArrowLeft } from "lucide-react";

const BACKEND_URL = "https://cinco-quiz-backend2.onrender.com";

export default function ViewResults() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    if (!roomCode.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/results/${roomCode.trim()}`);
      if (!res.ok) {
        setError("Results not found for this room code.");
        return;
      }
      const data = await res.json();
      setResults(data);
    } catch {
      setError("Failed to fetch results. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}><BarChart3 size={32} /> Past Results</h1>
        <p>Enter a room code to view quiz results</p>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <input
            type="text"
            placeholder="Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchResults()}
            maxLength={6}
            style={{ flex: 1 }}
          />
          <button className="btn-primary btn-small" onClick={fetchResults} disabled={loading} style={{ width: "auto" }}>
            {loading ? "..." : "Look Up"}
          </button>
        </div>

        {error && (
          <p style={{ color: "var(--wrong-red)", fontSize: 14, marginTop: 12 }}>{error}</p>
        )}

        {results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: 20, textAlign: "left" }}
          >
            <h3>Room: {results.roomCode}</h3>
            {results.players && results.players.length > 0 ? (
              results.players.map((p, i) => (
                <div className={`leaderboard-row ${i === 0 ? "rank-1" : ""}`} key={i}>
                  <span className="leaderboard-rank">
                    {i === 0 ? <Medal size={18} color="#DCA278" /> : i === 1 ? <Medal size={18} color="#B8AFA5" /> : i === 2 ? <Medal size={18} color="#CDD4B1" /> : `#${i + 1}`}
                  </span>
                  <span className="leaderboard-name">{p.username}</span>
                  <span className="leaderboard-score">{p.score}</span>
                </div>
              ))
            ) : (
              <p>No player data found.</p>
            )}
          </motion.div>
        )}

        <button onClick={() => navigate("/")} className="btn-small" style={{ marginTop: 20, width: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <ArrowLeft size={14} color="#6B6558" /> Back to Home
        </button>
      </motion.div>
    </div>
  );
}
