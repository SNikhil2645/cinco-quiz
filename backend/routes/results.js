const express = require("express");
const router = express.Router();
const Result = require("../models/Result");

router.get("/:roomCode", async (req, res) => {
  try {
    const result = await Result.findOne({ roomCode: req.params.roomCode });
    if (!result) return res.status(404).json({ error: "Results not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const recent = await Result.find().sort({ completedAt: -1 }).limit(10);
    res.json(recent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
