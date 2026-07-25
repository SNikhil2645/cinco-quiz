import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Crosshair, UsersRound, Globe, ArrowLeft } from "lucide-react";

export default function ModeSelect() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1>Select Mode</h1>
        <p>Choose how you want to play</p>

        <button className="btn-primary" onClick={() => navigate("/singleplayer")} style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Crosshair size={18} /> Single Player
        </button>

        <button onClick={() => navigate("/create-room")} style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <UsersRound size={18} /> Create Room
        </button>

        <button onClick={() => navigate("/join-room")} style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Globe size={18} /> Join Room
        </button>

        <button onClick={() => navigate("/")} style={{ marginTop: 20, opacity: 0.6, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <ArrowLeft size={16} /> Back
        </button>
      </motion.div>
    </div>
  );
}
