const socket = io(
    "https://cinco-quiz-backend.onrender.com"
);


// SOCKET CONNECT

socket.on(
    "connect",
    () => {

        console.log(
            "Connected To Server 🚀"
        );

    }
);


// BUTTONS

const createBtn =
    document.getElementById("create-btn");

const joinBtn =
    document.getElementById("join-btn");

const joinRoomBtn =
    document.getElementById("join-room-btn");

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


// SCREENS

const homeScreen =
    document.getElementById("home-screen");

const setupScreen =
    document.getElementById("setup-screen");

const quizScreen =
    document.getElementById("quiz-screen");

const resultScreen =
    document.getElementById("result-screen");


// TOPICS

const topicButtons =
    document.querySelectorAll(".topic-btn");

const selectedTopicText =
    document.getElementById("selected-topic");


// QUIZ

const questionText =
    document.getElementById("question-text");

const answerButtons =
    document.querySelectorAll(".answer-btn");

const timerText =
    document.getElementById("timer");

const finalScore =
    document.getElementById("final-score");

const progressBar =
    document.getElementById("progress-bar");


// ROOM

const roomInput =
    document.getElementById("room-input");

const roomStatus =
    document.getElementById("room-status");


// VARIABLES

let selectedTopic = "";

let currentQuestion = 0;

let score = 0;

let selectedAnswer = "";

let quizData = [];

let timer;

let timeLeft = 10;


// CREATE ROOM

createBtn.addEventListener(
    "click",
    () => {

        socket.emit(
            "create-room"
        );

    }
);


// ROOM CREATED

socket.on(
    "room-created",
    (roomCode) => {

        roomStatus.innerText =
            "Room Code : " +
            roomCode;

        alert(
            "Room Created 🚀\nCode : " +
            roomCode
        );

    }
);


// JOIN QUIZ

joinBtn.addEventListener(
    "click",
    () => {

        const roomCode =
            roomInput.value;

        if (roomCode === "") {

            alert(
                "Enter Room Code ❌"
            );

            return;

        }

        socket.emit(
            "join-room",
            roomCode
        );

    }
);


// JOIN ROOM BUTTON

joinRoomBtn.addEventListener(
    "click",
    () => {

        const roomCode =
            roomInput.value;

        if (roomCode === "") {

            alert(
                "Enter Room Code ❌"
            );

            return;

        }

        socket.emit(
            "join-room",
            roomCode
        );

    }
);


// PLAYER JOINED

socket.on(
    "player-joined",
    (count) => {

        roomStatus.innerText =
            "Players Joined : " +
            count;

        alert(
            "Player Joined 🚀"
        );

    }
);


// ROOM ERROR

socket.on(
    "room-error",
    (message) => {

        alert(message);

    }
);


// BACK BUTTON

backBtn.addEventListener(
    "click",
    () => {

        setupScreen.style.display =
            "none";

        homeScreen.style.display =
            "flex";

    }
);


// TOPIC SELECT

topicButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            topicButtons.forEach(
                (btn) => {

                    btn.style.background =
                        "rgba(255,255,255,0.15)";

                }
            );

            button.style.background =
                "rgba(255,255,255,0.35)";

            selectedTopic =
                button.innerText;

            selectedTopicText.innerText =
                "Selected Topic : " +
                selectedTopic;

            startQuizBtn.style.display =
                "block";

        }
    );

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
                "https://cinco-quiz-backend.onrender.com/quiz"
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

    const progress =
        (
            currentQuestion /
            quizData.length
        ) * 100;

    progressBar.style.width =
        progress + "%";

    const currentQuiz =
        quizData[currentQuestion];

    questionText.innerText =
        currentQuiz.question;

    answerButtons.forEach(
        (button, index) => {

            button.innerText =
                currentQuiz.options[index];

            button.style.background =
                "rgba(255,255,255,0.15)";

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

    button.addEventListener(
        "click",
        () => {

            answerButtons.forEach(
                (btn) => {

                    btn.style.background =
                        "rgba(255,255,255,0.15)";

                }
            );

            button.style.background =
                "rgba(255,255,255,0.35)";

            selectedAnswer =
                button.innerText;

        }
    );

});


// NEXT BUTTON

nextBtn.addEventListener(
    "click",
    () => {

        nextQuestion();

    }
);


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

    progressBar.style.width =
        "100%";

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