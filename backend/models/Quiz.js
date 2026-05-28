const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({

    question: String,

    options: [String],

    correct: String

});

module.exports =
    mongoose.model(
        "Quiz",
        quizSchema
    );