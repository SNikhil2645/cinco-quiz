const Quiz = require("../models/Quiz");
const Room = require("../models/Room");
const Result = require("../models/Result");

const rooms = {};

function generateCode() {
  let code;
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  } while (rooms[code]);
  return code;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calculateScore(isCorrect, timeTaken, timeLimit, streak, doubleActive, correctCount, totalAnswered) {
  if (!isCorrect) return { scoreGain: 0, newStreak: 0, newMultiplier: 1 };

  const speedRatio = Math.max(0, 1 - timeTaken / timeLimit);
  const speedBonus = Math.round(speedRatio * 25);

  const accuracyRatio = totalAnswered > 0 ? correctCount / totalAnswered : 0;
  const accuracyBonus = Math.round(accuracyRatio * 25);

  const base = 50 + speedBonus + accuracyBonus;

  const newStreak = streak + 1;
  let multiplier = 1;
  if (newStreak >= 3) multiplier = 3;
  else if (newStreak >= 2) multiplier = 2;

  let scoreGain = base * multiplier;
  if (doubleActive) scoreGain *= 2;
  return { scoreGain, newStreak, newMultiplier: multiplier };
}

function getLeaderboard(room) {
  return room.players
    .filter((p) => !p.isSpectating)
    .map((p) => {
      const totalAnswered = p.answers.filter((a) => a !== null).length;
      const accuracy = totalAnswered > 0 ? Math.round((p.correctCount / totalAnswered) * 100) : 0;
      const totalTime = p.answerTimes.reduce((a, b) => a + b, 0);
      return {
        username: p.username,
        score: p.score,
        accuracy,
        totalTime,
        streakMax: p.maxStreak,
        correctCount: p.correctCount,
        totalQuestions: room.questions.length,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function getRoomPlayers(room) {
  return room.players.map((p) => ({
    username: p.username,
    isHost: p.socketId === room.host,
    isSpectating: p.isSpectating || false,
  }));
}

function checkQuizEnd(io, roomCode) {
  const room = rooms[roomCode];
  if (!room || room.status === "finished") return;

  const activePlayers = room.players.filter((p) => !p.isSpectating);
  const allFinished = activePlayers.length > 0 && activePlayers.every((p) => p.finished);

  if (allFinished && !room.quizEnding) {
    room.quizEnding = true;
    setTimeout(() => endQuiz(io, roomCode), 2000);
  }
}

function sendQuestionToPlayer(io, room, player) {
  if (player.isSpectating || player.finished) return;

  const quiz = room.fullQuestions ? room.fullQuestions[player.currentQuestion] : null;
  if (!quiz) return;

  io.to(player.socketId).emit("new-question", {
    question: {
      question: quiz.question,
      options: quiz.options,
      explanation: quiz.explanation || "",
    },
    questionIndex: player.currentQuestion,
    totalQuestions: room.questions.length,
    timePerQuestion: room.settings.timer,
  });
}

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("create-room", async (data) => {
      const code = generateCode();
      const { hostName, settings } = data;
      const isSpectating = !!settings.isSpectating;

      rooms[code] = {
        host: socket.id,
        hostName,
        players: [{
          socketId: socket.id,
          username: hostName,
          score: 0,
          streak: 0,
          maxStreak: 0,
          answers: [],
          answerTimes: [],
          correctCount: 0,
          powerups: { fiftyFifty: true, doublePoints: true, freezeTimer: true },
          doublePointsActive: false,
          currentQuestion: 0,
          finished: false,
          isSpectating,
        }],
        settings,
        questions: [],
        status: "waiting",
      };

      try {
        const query = {};
        if (settings.topic !== "Mixed (All Topics)") query.topic = settings.topic;
        query.difficulty = settings.difficulty;
        const allQuestions = await Quiz.find(query);
        const shuffled = shuffleArray(allQuestions);
        const selected = shuffled.slice(0, settings.questionCount);
        rooms[code].questions = selected.map((q) => q._id.toString());
        rooms[code].fullQuestions = selected.map((q) => q.toObject());
      } catch (err) {
        console.error("Error fetching questions:", err.message);
      }

      socket.join(code);
      socket.emit("room-created", {
        roomCode: code,
        players: getRoomPlayers(rooms[code]),
      });

      console.log("Room created:", code);
    });

    socket.on("join-room", (data) => {
      const { roomCode, username } = data;
      const room = rooms[roomCode];
      if (!room) {
        socket.emit("room-error", "Room not found");
        return;
      }
      if (room.status !== "waiting") {
        socket.emit("room-error", "Quiz already in progress");
        return;
      }
      if (room.players.length >= 10) {
        socket.emit("room-error", "Room is full (max 10 players)");
        return;
      }
      if (room.players.some((p) => p.username === username)) {
        socket.emit("room-error", "Username already taken in this room");
        return;
      }

      room.players.push({
        socketId: socket.id,
        username,
        score: 0,
        streak: 0,
        maxStreak: 0,
        answers: [],
        answerTimes: [],
        correctCount: 0,
        powerups: { fiftyFifty: true, doublePoints: true, freezeTimer: true },
        doublePointsActive: false,
        currentQuestion: 0,
        finished: false,
        isSpectating: false,
      });

      socket.join(roomCode);
      io.to(roomCode).emit("player-joined", {
        roomCode,
        players: getRoomPlayers(room),
      });
      console.log(`${username} joined room ${roomCode}`);
    });

    socket.on("start-quiz", (data) => {
      const { roomCode } = data;
      const room = rooms[roomCode];
      if (!room || room.host !== socket.id) return;

      const activePlayers = room.players.filter((p) => !p.isSpectating);
      if (activePlayers.length < 1) return;

      room.status = "active";
      const hostPlayer = room.players.find((p) => p.socketId === room.host);
      const hostSpectating = hostPlayer?.isSpectating || false;
      io.to(roomCode).emit("quiz-started", { roomCode, isSpectating: hostSpectating });
    });

    socket.on("submit-answer", (data) => {
      const { roomCode, questionIndex, answer, timeTaken } = data;
      const room = rooms[roomCode];
      if (!room) return;

      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player || player.isSpectating) return;
      if (player.answers[questionIndex] !== undefined) return;

      player.answers[questionIndex] = answer;
      player.answerTimes[questionIndex] = timeTaken;

      const quiz = room.fullQuestions ? room.fullQuestions[questionIndex] : null;
      if (!quiz) return;

      const isCorrect = answer === quiz.correct;
      const totalAnswered = player.answers.filter((a) => a !== null).length;
      if (isCorrect) player.correctCount++;

      const { scoreGain, newStreak, newMultiplier } = calculateScore(
        isCorrect, timeTaken, room.settings.timer, player.streak, player.doublePointsActive,
        player.correctCount, totalAnswered
      );

      player.score += scoreGain;
      player.streak = newStreak;
      if (newStreak > player.maxStreak) player.maxStreak = newStreak;
      player.doublePointsActive = false;

      socket.emit("answer-result", {
        isCorrect,
        correctAnswer: quiz.correct,
        scoreGain,
        newStreak,
        newMultiplier,
      });

      socket.to(roomCode).emit("opponent-answered", {
        username: player.username,
        questionIndex,
      });

      const leaderboard = getLeaderboard(room);
      io.to(roomCode).emit("leaderboard-update", { leaderboard });
    });

    socket.on("next-question", (data) => {
      const { roomCode } = data;
      const room = rooms[roomCode];
      if (!room || room.status !== "active") return;

      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player || player.isSpectating) return;

      if (player.currentQuestion + 1 >= room.questions.length) {
        player.finished = true;
        socket.emit("player-finished", {
          questionIndex: player.currentQuestion,
          totalQuestions: room.questions.length,
        });
        const leaderboard = getLeaderboard(room);
        io.to(roomCode).emit("leaderboard-update", { leaderboard });
        checkQuizEnd(io, roomCode);
      } else {
        player.currentQuestion++;
        sendQuestionToPlayer(io, room, player);
      }
    });

    socket.on("use-powerup", (data) => {
      const { roomCode, type, questionIndex } = data;
      const room = rooms[roomCode];
      if (!room || !room.settings.powerupsEnabled) return;

      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player || player.isSpectating) return;
      if (!player.powerups[type]) return;

      player.powerups[type] = false;

      if (type === "fiftyFifty") {
        const quiz = room.fullQuestions ? room.fullQuestions[questionIndex] : null;
        if (!quiz) return;
        const wrong = quiz.options.filter((o) => o !== quiz.correct);
        const shuffled = shuffleArray(wrong);
        const eliminate = shuffled.slice(0, 2);
        socket.emit("eliminated-options", { options: eliminate });
      } else if (type === "doublePoints") {
        player.doublePointsActive = true;
      } else if (type === "freezeTimer") {
        socket.emit("timer-update", { timeLeft: room.settings.timer });
      }

      io.to(roomCode).emit("powerup-used", { username: player.username, type });
    });

    socket.on("start-singleplayer", async (data) => {
      const { username, topic, difficulty, questionCount, timer } = data;
      const code = "SP-" + generateCode();

      const query = {};
      if (topic !== "Mixed (All Topics)") query.topic = topic;
      query.difficulty = difficulty;

      let questions;
      try {
        const allQ = await Quiz.find(query);
        questions = shuffleArray(allQ).slice(0, questionCount);
      } catch (err) {
        questions = [];
      }

      rooms[code] = {
        host: socket.id,
        hostName: username,
        players: [{
          socketId: socket.id,
          username,
          score: 0,
          streak: 0,
          maxStreak: 0,
          answers: [],
          answerTimes: [],
          correctCount: 0,
          powerups: { fiftyFifty: true, doublePoints: true, freezeTimer: true },
          doublePointsActive: false,
          currentQuestion: 0,
          finished: false,
          isSpectating: false,
        }],
        settings: { topic, difficulty, questionCount, timer, powerupsEnabled: true },
        questions: questions.map((q) => q._id.toString()),
        fullQuestions: questions,
        status: "active",
        isSingleplayer: true,
      };

      socket.join(code);
      socket.emit("singleplayer-started", { roomCode: code });
    });

    socket.on("request-question", async (data) => {
      const { roomCode } = data;
      const room = rooms[roomCode];
      if (!room) return;
      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player || player.isSpectating || player.finished) return;

      sendQuestionToPlayer(io, room, player);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const code in rooms) {
        const room = rooms[code];
        if (!room) continue;
        const idx = room.players.findIndex((p) => p.socketId === socket.id);
        if (idx === -1) continue;

        if (room.host === socket.id) {
          if (room.status === "active") {
            const activePlayers = room.players.filter((p) => !p.isSpectating);
            if (activePlayers.length > 1 || (activePlayers.length === 1 && activePlayers[0].answers.length > 0)) {
              const leaderboard = getLeaderboard(room);
              try {
                Result.create({
                  roomCode: code,
                  players: leaderboard,
                  settings: {
                    topic: room.settings.topic,
                    difficulty: room.settings.difficulty,
                    questionCount: room.settings.questionCount,
                  },
                });
              } catch (err) {
                console.error("Error saving partial results:", err.message);
              }
              io.to(code).emit("quiz-ended", { leaderboard });
            } else {
              io.to(code).emit("room-error", "Host disconnected");
            }
          } else {
            io.to(code).emit("room-error", "Host disconnected");
          }
          delete rooms[code];
        } else {
          room.players.splice(idx, 1);
          io.to(code).emit("player-joined", {
            roomCode: code,
            players: getRoomPlayers(room),
          });
          if (room.status === "active") {
            checkQuizEnd(io, code);
          }
        }
      }
    });

    socket.on("rejoin-room", (data) => {
      const { roomCode, username, isHost } = data;
      const room = rooms[roomCode];
      if (!room) return;
      if (room.status === "finished") return;

      const player = room.players.find((p) => p.username === username);
      if (!player) return;

      const oldSocketId = player.socketId;
      player.socketId = socket.id;
      socket.join(roomCode);

      if (isHost && room.host === oldSocketId) {
        room.host = socket.id;
      }

      if (room.status === "active") {
        if (player.isSpectating) {
          socket.emit("rejoined", {
            roomCode,
            status: "active",
            isHost: socket.id === room.host,
            isSpectating: true,
            players: getRoomPlayers(room),
            leaderboard: getLeaderboard(room),
          });
        } else {
          const quiz = room.fullQuestions ? room.fullQuestions[player.currentQuestion] : null;
          socket.emit("rejoined", {
            roomCode,
            question: quiz
              ? { question: quiz.question, options: quiz.options, explanation: quiz.explanation || "" }
              : null,
            questionIndex: player.currentQuestion,
            totalQuestions: room.questions.length,
            timePerQuestion: room.settings.timer,
            score: player.score,
            streak: player.streak,
            maxStreak: player.maxStreak,
            powerups: player.powerups,
            isHost: socket.id === room.host,
            isSpectating: false,
            leaderboard: getLeaderboard(room),
            players: getRoomPlayers(room),
          });
        }
      } else {
        socket.emit("rejoined", {
          roomCode,
          status: room.status,
          isHost: socket.id === room.host,
          isSpectating: player.isSpectating,
          players: getRoomPlayers(room),
        });
      }
    });
  });
};

async function endQuiz(io, roomCode) {
  const room = rooms[roomCode];
  if (!room || room.status === "finished") return;

  room.status = "finished";
  const leaderboard = getLeaderboard(room);

  try {
    await Result.create({
      roomCode,
      players: leaderboard,
      settings: {
        topic: room.settings.topic,
        difficulty: room.settings.difficulty,
        questionCount: room.settings.questionCount,
      },
    });
  } catch (err) {
    console.error("Error saving results:", err.message);
  }

  io.to(roomCode).emit("quiz-ended", { leaderboard });
  console.log("Quiz ended:", roomCode);

  setTimeout(() => {
    delete rooms[roomCode];
  }, 60000);
}
