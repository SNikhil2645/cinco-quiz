const socket = io(
    "https://cinco-quiz-backend.onrender.com"
);

// SCREENS

const homeScreen = document.getElementById("home-screen");
const modeScreen = document.getElementById("mode-screen");
const singleplayerScreen = document.getElementById("singleplayer-screen");
const multiplayerScreen = document.getElementById("multiplayer-screen");
const joinScreen = document.getElementById("join-screen");
const hostLobby = document.getElementById("host-lobby");
const playerLobby = document.getElementById("player-lobby");
const quizScreen = document.getElementById("quiz-screen");
const leaderboardScreen = document.getElementById("leaderboard-screen");
const podiumScreen = document.getElementById("podium-screen");
const resultScreen = document.getElementById("result-screen");

// BUTTONS

const playBtn = document.getElementById("play-btn");
const singleplayerBtn = document.getElementById("singleplayer-btn");
const multiplayerBtn = document.getElementById("multiplayer-btn");

const modeBackBtn = document.getElementById("mode-back-btn");
const singleBackBtn = document.getElementById("single-back-btn");
const multiplayerBackBtn = document.getElementById("multiplayer-back-btn");
const joinBackBtn = document.getElementById("join-back-btn");

const createRoomBtn = document.getElementById("create-room-btn");
const joinRoomScreenBtn = document.getElementById("join-room-screen-btn");
const joinRoomBtn = document.getElementById("join-room-btn");

// INPUTS

const playerName = document.getElementById("player-name");
const roomCodeInput = document.getElementById("room-code-input");

// LOBBY ELEMENTS

const roomCodeDisplay =
    document.getElementById("room-code-display");

const hostPlayerCount =
    document.getElementById("host-player-count");

const playerCount =
    document.getElementById("player-count");

const hostPlayerList =
    document.getElementById("host-player-list");

const playerList =
    document.getElementById("player-list");

// VARIABLES

let isHost = false;

// UTIL

function hideAllScreens() {

    homeScreen.style.display = "none";
    modeScreen.style.display = "none";
    singleplayerScreen.style.display = "none";
    multiplayerScreen.style.display = "none";
    joinScreen.style.display = "none";
    hostLobby.style.display = "none";
    playerLobby.style.display = "none";
    quizScreen.style.display = "none";
    leaderboardScreen.style.display = "none";
    podiumScreen.style.display = "none";
    resultScreen.style.display = "none";

}

// HOME -> MODE

playBtn.addEventListener(
    "click",
    () => {

        hideAllScreens();

        modeScreen.style.display = "flex";

    }
);

// MODE -> SINGLEPLAYER

singleplayerBtn.addEventListener(
    "click",
    () => {

        hideAllScreens();

        singleplayerScreen.style.display = "flex";

    }
);

// MODE -> MULTIPLAYER

multiplayerBtn.addEventListener(
    "click",
    () => {

        hideAllScreens();

        multiplayerScreen.style.display = "flex";

    }
);

// MULTIPLAYER -> JOIN SCREEN

joinRoomScreenBtn.addEventListener(
    "click",
    () => {

        hideAllScreens();

        joinScreen.style.display = "flex";

    }
);

// CREATE ROOM

createRoomBtn.addEventListener(
    "click",
    () => {

        isHost = true;

        socket.emit(
            "create-room"
        );

    }
);

// JOIN ROOM

joinRoomBtn.addEventListener(
    "click",
    () => {

        const username =
            playerName.value.trim();

        const roomCode =
            roomCodeInput.value.trim();

        if (
            username === "" ||
            roomCode === ""
        ) {

            alert(
                "Enter Username and Room Code"
            );

            return;

        }

        socket.emit(
            "join-room",
            {
                username,
                roomCode
            }
        );

    }
);

// BACK BUTTONS

modeBackBtn.addEventListener(
    "click",
    () => {

        hideAllScreens();

        homeScreen.style.display = "flex";

    }
);

singleBackBtn.addEventListener(
    "click",
    () => {

        hideAllScreens();

        modeScreen.style.display = "flex";

    }
);

multiplayerBackBtn.addEventListener(
    "click",
    () => {

        hideAllScreens();

        modeScreen.style.display = "flex";

    }
);

joinBackBtn.addEventListener(
    "click",
    () => {

        hideAllScreens();

        multiplayerScreen.style.display = "flex";

    }
);

// SOCKET EVENTS

socket.on(
    "connect",
    () => {

        console.log(
            "Connected:",
            socket.id
        );

    }
);

// ROOM CREATED

socket.on(
    "room-created",
    (roomCode) => {

        hideAllScreens();

        hostLobby.style.display =
            "flex";

        roomCodeDisplay.innerText =
            "Room : " + roomCode;

        console.log(
            "Room Created:",
            roomCode
        );

    }
);

// PLAYER JOINED

socket.on(
    "player-joined",
    (data) => {

        if (isHost) {

            hideAllScreens();

            hostLobby.style.display =
                "flex";

        } else {

            hideAllScreens();

            playerLobby.style.display =
                "flex";

        }

        hostPlayerCount.innerText =
            "Players : " +
            data.players.length;

        playerCount.innerText =
            "Players : " +
            data.players.length;

        hostPlayerList.innerHTML = "";
        playerList.innerHTML = "";

        data.players.forEach(
            (player) => {

                const hostItem =
                    document.createElement("div");

                hostItem.innerHTML =
                    "👤 " +
                    player.username;

                hostPlayerList.appendChild(
                    hostItem
                );

                const playerItem =
                    document.createElement("div");

                playerItem.innerHTML =
                    "👤 " +
                    player.username;

                playerList.appendChild(
                    playerItem
                );

            }
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