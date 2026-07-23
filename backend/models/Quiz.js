const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true, validate: { validator: (v) => v.length === 4 } },
  correct: { type: String, required: true },
  explanation: { type: String, default: "" },
});

quizSchema.index({ topic: 1, difficulty: 1 });

module.exports = mongoose.model("Quiz", quizSchema);
