import { create } from "zustand";

const useUserStore = create((set) => ({
  username: "",
  isHost: false,
  isSpectating: false,
  roomCode: "",
  setUsername: (username) => set({ username }),
  setIsHost: (isHost) => set({ isHost }),
  setIsSpectating: (isSpectating) => set({ isSpectating }),
  setRoomCode: (roomCode) => set({ roomCode }),
}));

export default useUserStore;
