const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  roomCode: { type: String, required: true },
  players: [{
    username: String,
    score: Number,
    accuracy: Number,
    totalTime: Number,
    streakMax: Number,
    correctCount: Number,
    totalQuestions: Number,
    powerupsUsed: {
      fiftyFifty: { type: Number, default: 0 },
      doublePoints: { type: Number, default: 0 },
      freezeTimer: { type: Number, default: 0 },
    },
  }],
  settings: {
    topic: String,
    difficulty: String,
    questionCount: Number,
  },
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", resultSchema);
