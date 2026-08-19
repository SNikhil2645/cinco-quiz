import { BrowserRouter, Routes, Route } from "react-router-dom";
import ParticleBackground from "./components/ParticleBackground";
import CardGlow from "./components/CardGlow";
import Home from "./pages/Home";
import ModeSelect from "./pages/ModeSelect";
import SinglePlayerSetup from "./pages/SinglePlayerSetup";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import HostLobby from "./pages/HostLobby";
import PlayerLobby from "./pages/PlayerLobby";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import ViewResults from "./pages/ViewResults";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-bg">
        <ParticleBackground />
        <CardGlow />
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
          <Route path="/view-results" element={<ViewResults />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
