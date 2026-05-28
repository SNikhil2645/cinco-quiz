const express = require("express");

const cors = require("cors");

const app = express();


// MIDDLEWARE

app.use(cors());

app.use(express.json());


// HOME ROUTE

app.get("/", (req, res) => {

    res.send(
        "Cinco Quiz Backend Running 🚀"
    );

});


// QUIZ API ROUTE

app.get("/quiz", (req, res) => {

    const quizData = [

        {
            question:
                "Which keyword is used to create a function in Python?",

            options: [
                "func",
                "function",
                "def",
                "create"
            ],

            correct:
                "def"
        },

        {
            question:
                "Which symbol is used for comments in Python?",

            options: [
                "//",
                "#",
                "/*",
                "--"
            ],

            correct:
                "#"
        },

        {
            question:
                "Java is developed by?",

            options: [
                "Google",
                "Microsoft",
                "Sun Microsystems",
                "Apple"
            ],

            correct:
                "Sun Microsystems"
        }

    ];

    res.json(quizData);

});


// SERVER

app.listen(5000, () => {

    console.log(
        "Server running on port 5000 🚀"
    );

});