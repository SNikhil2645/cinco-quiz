require("dotenv").config();
const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const questions = require("./questions");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const count = await Quiz.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} questions. Skipping seed.`);
      console.log("Drop the Quiz collection first if you want to re-seed.");
      process.exit(0);
    }

    const result = await Quiz.insertMany(questions);
    console.log(`Seeded ${result.length} questions successfully`);

    const topics = await Quiz.aggregate([
      { $group: { _id: "$topic", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    console.log("\nQuestions by topic:");
    topics.forEach((t) => console.log(`  ${t._id}: ${t.count}`));

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seed();
