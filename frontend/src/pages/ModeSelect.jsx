import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ModeSelect() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Select Mode</h1>
        <p>Choose how you want to play</p>

        <button className="btn-primary" onClick={() => navigate("/singleplayer")} style={{ marginTop: 24 }}>
          🎯 Single Player
        </button>

        <button onClick={() => navigate("/create-room")} style={{ marginTop: 12 }}>
          🏠 Create Room (Host)
        </button>

        <button onClick={() => navigate("/join-room")} style={{ marginTop: 12 }}>
          🌍 Join Room
        </button>

        <button onClick={() => navigate("/")} style={{ marginTop: 20, opacity: 0.6 }}>
          ← Back
        </button>
      </motion.div>
    </div>
  );
}
