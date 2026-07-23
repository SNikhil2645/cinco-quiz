import { create } from "zustand";

const useGameStore = create((set) => ({
  players: [],
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 0,
  timePerQuestion: 15,
  timeLeft: 15,
  selectedAnswer: null,
  answerSubmitted: false,
  showResult: false,
  isCorrect: false,
  correctAnswer: "",
  score: 0,
  streak: 0,
  maxStreak: 0,
  multiplier: 1,
  powerups: { fiftyFifty: true, doublePoints: true, freezeTimer: true },
  eliminatedOptions: [],
  leaderboard: [],
  lastScoreUpdate: null,

  setPlayers: (players) => set({ players }),
  setQuestion: (question, index, total) =>
    set({
      currentQuestion: question,
      questionIndex: index,
      totalQuestions: total,
      selectedAnswer: null,
      answerSubmitted: false,
      showResult: false,
      isCorrect: false,
      correctAnswer: "",
      eliminatedOptions: [],
    }),
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  setSelectedAnswer: (selectedAnswer) => set({ selectedAnswer }),
  setAnswerSubmitted: (answerSubmitted) => set({ answerSubmitted }),
  setResult: (isCorrect, correctAnswer, scoreGain, newStreak, newMultiplier) =>
    set((state) => ({
      showResult: true,
      isCorrect,
      correctAnswer,
      score: state.score + scoreGain,
      streak: newStreak,
      maxStreak: Math.max(state.maxStreak, newStreak),
      multiplier: newMultiplier,
    })),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  usePowerup: (type) =>
    set((state) => ({
      powerups: { ...state.powerups, [type]: false },
    })),
  eliminateOptions: (options) => set({ eliminatedOptions: options }),
  resetGame: () =>
    set({
      currentQuestion: null,
      questionIndex: 0,
      totalQuestions: 0,
      selectedAnswer: null,
      answerSubmitted: false,
      showResult: false,
      isCorrect: false,
      correctAnswer: "",
      score: 0,
      streak: 0,
      maxStreak: 0,
      multiplier: 1,
      powerups: { fiftyFifty: true, doublePoints: true, freezeTimer: true },
      eliminatedOptions: [],
      leaderboard: [],
    }),
}));

export default useGameStore;
