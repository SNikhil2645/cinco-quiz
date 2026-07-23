import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ModeSelect from "./pages/ModeSelect";
import SinglePlayerSetup from "./pages/SinglePlayerSetup";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import HostLobby from "./pages/HostLobby";
import PlayerLobby from "./pages/PlayerLobby";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-bg">
        <div className="bg-bubble bg-bubble-1" />
        <div className="bg-bubble bg-bubble-2" />
        <div className="bg-bubble bg-bubble-3" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mode" element={<ModeSelect />} />
          <Route path="/singleplayer" element={<SinglePlayerSetup />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/host-lobby" element={<HostLobby />} />
          <Route path="/player-lobby" element={<PlayerLobby />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
