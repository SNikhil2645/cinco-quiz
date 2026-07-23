import { create } from "zustand";

const useUserStore = create((set) => ({
  username: "",
  isHost: false,
  roomCode: "",
  setUsername: (username) => set({ username }),
  setIsHost: (isHost) => set({ isHost }),
  setRoomCode: (roomCode) => set({ roomCode }),
}));

export default useUserStore;
