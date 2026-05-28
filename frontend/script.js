const createBtn =
    document.getElementById("create-btn");

const joinBtn =
    document.getElementById("join-btn");

const backBtn =
    document.getElementById("back-btn");

const startQuizBtn =
    document.getElementById("start-quiz-btn");

const nextBtn =
    document.getElementById("next-btn");

const restartBtn =
    document.getElementById("restart-btn");

const homeBtn =
    document.getElementById("home-btn");

const homeScreen =
    document.getElementById("home-screen");

const setupScreen =
    document.getElementById("setup-screen");

const quizScreen =
    document.getElementById("quiz-screen");

const resultScreen =
    document.getElementById("result-screen");

const topicButtons =
    document.querySelectorAll(".topic-btn");

const selectedTopicText =
    document.getElementById("selected-topic");

const questionText =
    document.getElementById("question-text");

const answerButtons =
    document.querySelectorAll(".answer-btn");

const timerText =
    document.getElementById("timer");

const finalScore =
    document.getElementById("final-score");


// VARIABLES

let selectedTopic = "";

let currentQuestion = 0;

let score = 0;

let selectedAnswer = "";

let quizData = [];

let timer;

let timeLeft = 10;


// CREATE QUIZ

createBtn.addEventListener("click", () => {

    homeScreen.style.display =
        "none";

    setupScreen.style.display =
        "flex";

});


// JOIN QUIZ

joinBtn.addEventListener("click", () => {

    alert(
        "Join Quiz Coming Soon 🚀"
    );

});


// BACK BUTTON

backBtn.addEventListener("click", () => {

    setupScreen.style.display =
        "none";

    homeScreen.style.display =
        "flex";

});


// TOPIC SELECT

topicButtons.forEach((button) => {

    button.addEventListener("click", () => {

        topicButtons.forEach((btn) => {

            btn.style.background =
                "rgba(255,255,255,0.1)";

        });

        button.style.background =
            "#ffffff33";

        selectedTopic =
            button.innerText;

        selectedTopicText.innerText =
            "Selected Topic : " +
            selectedTopic;

        startQuizBtn.style.display =
            "inline-block";

    });

});


// START QUIZ

startQuizBtn.addEventListener(
    "click",
    async () => {

        setupScreen.style.display =
            "none";

        quizScreen.style.display =
            "flex";

        currentQuestion = 0;

        score = 0;

        const response =
            await fetch(
                "http://localhost:5000/quiz"
            );

        quizData =
            await response.json();

        loadQuestion();

    }
);


// LOAD QUESTION

function loadQuestion() {

    clearInterval(timer);

    timeLeft = 10;

    startTimer();

    selectedAnswer = "";

    const currentQuiz =
        quizData[currentQuestion];

    questionText.innerText =
        currentQuiz.question;

    answerButtons.forEach(
        (button, index) => {

            button.innerText =
                currentQuiz.options[index];

            button.style.background =
                "rgba(255,255,255,0.1)";

        }
    );

}


// TIMER

function startTimer() {

    timerText.innerText =
        "Time Left : " + timeLeft;

    timer = setInterval(() => {

        timeLeft--;

        timerText.innerText =
            "Time Left : " + timeLeft;

        if (timeLeft <= 0) {

            clearInterval(timer);

            nextQuestion();

        }

    }, 1000);

}


// ANSWER SELECT

answerButtons.forEach((button) => {

    button.addEventListener("click", () => {

        answerButtons.forEach((btn) => {

            btn.style.background =
                "rgba(255,255,255,0.1)";

        });

        button.style.background =
            "#ffffff33";

        selectedAnswer =
            button.innerText;

    });

});


// NEXT BUTTON

nextBtn.addEventListener("click", () => {

    nextQuestion();

});


// NEXT QUESTION

function nextQuestion() {

    clearInterval(timer);

    const currentQuiz =
        quizData[currentQuestion];

    if (
        selectedAnswer ===
        currentQuiz.correct
    ) {

        score++;

    }

    currentQuestion++;

    if (
        currentQuestion <
        quizData.length
    ) {

        loadQuestion();

    } else {

        showResult();

    }

}


// SHOW RESULT

function showResult() {

    quizScreen.style.display =
        "none";

    resultScreen.style.display =
        "flex";

    finalScore.innerText =
        "Your Score : " +
        score +
        "/" +
        quizData.length;

}


// RESTART QUIZ

restartBtn.addEventListener(
    "click",
    () => {

        currentQuestion = 0;

        score = 0;

        resultScreen.style.display =
            "none";

        quizScreen.style.display =
            "flex";

        loadQuestion();

    }
);


// BACK HOME

homeBtn.addEventListener(
    "click",
    () => {

        resultScreen.style.display =
            "none";

        homeScreen.style.display =
            "flex";

    }
);