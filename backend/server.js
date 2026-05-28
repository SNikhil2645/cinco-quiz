const express = require("express");

const http = require("http");

const { Server } = require("socket.io");

const cors = require("cors");

const app = express();


// HTTP SERVER

const server =
    http.createServer(app);


// SOCKET SERVER

const io = new Server(server, {

    cors: {

        origin: "*"

    }

});


// MIDDLEWARE

app.use(cors());

app.use(express.json());


// ROOMS

const rooms = {};


// HOME ROUTE

app.get("/", (req, res) => {

    res.send(
        "Cinco Quiz Backend Running 🚀"
    );

});


// QUIZ API

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


// SOCKET CONNECTION

io.on("connection", (socket) => {

    console.log(
        "User Connected:",
        socket.id
    );


    // CREATE ROOM

    socket.on(
        "create-room",
        () => {

            const roomCode =
                Math.floor(
                    1000 +
                    Math.random() * 9000
                ).toString();

            rooms[roomCode] = [];

            socket.join(roomCode);

            rooms[roomCode].push(
                socket.id
            );

            socket.emit(
                "room-created",
                roomCode
            );

            console.log(
                "Room Created:",
                roomCode
            );

        }
    );


    // JOIN ROOM

    socket.on(
        "join-room",
        (roomCode) => {

            if (rooms[roomCode]) {

                socket.join(roomCode);

                rooms[roomCode].push(
                    socket.id
                );

                io.to(roomCode).emit(
                    "player-joined",
                    rooms[roomCode].length
                );

                console.log(
                    "Player Joined:",
                    roomCode
                );

            } else {

                socket.emit(
                    "room-error",
                    "Room Not Found ❌"
                );

            }

        }
    );

});


// SERVER

server.listen(5000, () => {

    console.log(
        "Server running on port 5000 🚀"
    );

});