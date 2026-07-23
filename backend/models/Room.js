const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  host: { type: String, required: true },
  hostName: { type: String, required: true },
  players: [{
    socketId: String,
    username: String,
    score: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    answers: [String],
    answerTimes: [Number],
    correctCount: { type: Number, default: 0 },
    powerups: {
      fiftyFifty: { type: Boolean, default: true },
      doublePoints: { type: Boolean, default: true },
      freezeTimer: { type: Boolean, default: true },
    },
    doublePointsActive: { type: Boolean, default: false },
  }],
  settings: {
    topic: { type: String, default: "Mixed (All Topics)" },
    difficulty: { type: String, default: "Easy" },
    questionCount: { type: Number, default: 5 },
    timer: { type: Number, default: 15 },
    powerupsEnabled: { type: Boolean, default: true },
  },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
  status: { type: String, enum: ["waiting", "active", "finished"], default: "waiting" },
  currentQuestion: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => Date.now() + 3600000 },
});

module.exports = mongoose.model("Room", roomSchema);
