import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Crosshair, UsersRound, Globe, ArrowLeft, ChevronRight } from "lucide-react";

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

        <button className="btn-primary btn-icon-badge" onClick={() => navigate("/singleplayer")} style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Crosshair size={18} /> Single Player
          <span className="icon-badge"><ChevronRight size={16} color="#5A5548" /></span>
        </button>

        <button onClick={() => navigate("/create-room")} style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <UsersRound size={18} color="#8A8072" /> Create Room
        </button>

        <button onClick={() => navigate("/join-room")} style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Globe size={18} color="#7A9068" /> Join Room
        </button>

        <button onClick={() => navigate("/")} style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <ArrowLeft size={16} color="#6B6558" /> Back
        </button>
      </motion.div>
    </div>
  );
}
