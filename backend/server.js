require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const socketHandler = require("./socket/handler");
const quizRoutes = require("./routes/quiz");
const resultRoutes = require("./routes/results");

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "*";

const allowedOrigins = [CLIENT_URL, "http://localhost:5173", "http://localhost:3000"];

const io = require("socket.io")(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ["GET", "POST"],
  },
  pingInterval: 25000,
  pingTimeout: 6000,
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ["GET", "POST"],
}));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ status: "CincoQuiz Backend Running", version: "2.0" });
});

app.use("/api/quiz", quizRoutes);
app.use("/api/results", resultRoutes);

socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`CincoQuiz server running on port ${PORT}`);
});
