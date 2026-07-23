const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");

router.get("/topics", async (req, res) => {
  try {
    const topics = await Quiz.distinct("topic");
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/questions", async (req, res) => {
  try {
    const { topic, difficulty, count } = req.query;
    const query = {};
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;
    const questions = await Quiz.find(query).limit(parseInt(count) || 20);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const total = await Quiz.countDocuments();
    const topics = await Quiz.aggregate([
      { $group: { _id: "$topic", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ total, topics });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
