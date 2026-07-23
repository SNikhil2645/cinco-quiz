import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useUserStore from "../store/userStore";
import useGameStore from "../store/gameStore";
import socket from "../socket/service";

export default function Quiz() {
  const navigate = useNavigate();
  const { username, isHost, roomCode } = useUserStore();
  const game = useGameStore();
  const gameRef = useRef(game);
  gameRef.current = game;

  const [timeLeft, setTimeLeftLocal] = useState(15);
  const [toast, setToast] = useState(null);
  const [opponentAnswered, setOpponentAnswered] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const timerRef = useRef(null);
  const timeLeftRef = useRef(15);
  const questionIndexRef = useRef(0);
  const timePerQuestionRef = useRef(15);

  useEffect(() => {
    questionIndexRef.current = game.questionIndex;
  }, [game.questionIndex]);

  const startTimer = (seconds) => {
    clearInterval(timerRef.current);
    timePerQuestionRef.current = seconds;
    setTimeLeftLocal(seconds);
    timeLeftRef.current = seconds;

    timerRef.current = setInterval(() => {
      const g = gameRef.current;
      const newTime = timeLeftRef.current - 1;
      timeLeftRef.current = newTime;
      setTimeLeftLocal(newTime);

      if (newTime <= 0) {
        clearInterval(timerRef.current);
        if (!g.answerSubmitted && !g.showResult) {
          useGameStore.getState().setAnswerSubmitted(true);
          socket.emit("submit-answer", {
            roomCode,
            questionIndex: questionIndexRef.current,
            answer: null,
            timeTaken: 0,
          });
        }
      }
    }, 1000);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const handleNewQuestion = (data) => {
      setShowLeaderboard(false);
      useGameStore.getState().setQuestion(
        data.question,
        data.questionIndex,
        data.totalQuestions
      );
      startTimer(data.timePerQuestion);
    };

    const handleAnswerResult = (data) => {
      clearInterval(timerRef.current);
      useGameStore.getState().setResult(
        data.isCorrect,
        data.correctAnswer,
        data.scoreGain,
        data.newStreak,
        data.newMultiplier
      );
    };

    const handleOpponentAnswer = (data) => {
      if (data.username !== username) {
        setOpponentAnswered(`${data.username} answered!`);
        setTimeout(() => setOpponentAnswered(null), 2000);
      }
    };

    const handleTimeWarning = () => {
      setToast("⏰ Time's almost up!");
      setTimeout(() => setToast(null), 1500);
    };

    const handleLeaderboardUpdate = (data) => {
      useGameStore.getState().setLeaderboard(data.leaderboard);
      setShowLeaderboard(true);
    };

    const handleQuizEnded = (data) => {
      clearInterval(timerRef.current);
      useGameStore.getState().setLeaderboard(data.leaderboard);
      navigate("/results");
    };

    const handlePowerupUsed = (data) => {
      if (data.username === username) return;
      setToast(`${data.username} used ${data.type}!`);
      setTimeout(() => setToast(null), 2000);
    };

    const handleEliminatedOptions = (data) => {
      useGameStore.getState().eliminateOptions(data.options);
    };

    socket.on("new-question", handleNewQuestion);
    socket.on("answer-result", handleAnswerResult);
    socket.on("opponent-answered", handleOpponentAnswer);
    socket.on("time-warning", handleTimeWarning);
    socket.on("leaderboard-update", handleLeaderboardUpdate);
    socket.on("quiz-ended", handleQuizEnded);
    socket.on("powerup-used", handlePowerupUsed);
    socket.on("eliminated-options", handleEliminatedOptions);

    return () => {
      socket.off("new-question", handleNewQuestion);
      socket.off("answer-result", handleAnswerResult);
      socket.off("opponent-answered", handleOpponentAnswer);
      socket.off("time-warning", handleTimeWarning);
      socket.off("leaderboard-update", handleLeaderboardUpdate);
      socket.off("quiz-ended", handleQuizEnded);
      socket.off("powerup-used", handlePowerupUsed);
      socket.off("eliminated-options", handleEliminatedOptions);
    };
  }, [navigate, username, roomCode]);

  useEffect(() => {
    socket.emit("request-question", { roomCode });
  }, []);

  const handleAnswer = (answer) => {
    if (game.answerSubmitted || game.showResult) return;
    clearInterval(timerRef.current);
    const timeTaken = timePerQuestionRef.current - timeLeftRef.current;
    useGameStore.getState().setSelectedAnswer(answer);
    useGameStore.getState().setAnswerSubmitted(true);
    socket.emit("submit-answer", {
      roomCode,
      questionIndex: game.questionIndex,
      answer,
      timeTaken,
    });
  };

  const handleNextQuestion = () => {
    socket.emit("next-question", { roomCode });
  };

  const handlePowerup = (type) => {
    if (!game.powerups[type]) return;
    if (type === "fiftyFifty") {
      socket.emit("use-powerup", { roomCode, type: "fiftyFifty", questionIndex: game.questionIndex });
    } else if (type === "doublePoints") {
      socket.emit("use-powerup", { roomCode, type: "doublePoints", questionIndex: game.questionIndex });
      setToast("⚡ Double Points activated!");
      setTimeout(() => setToast(null), 2000);
    } else if (type === "freezeTimer") {
      socket.emit("use-powerup", { roomCode, type: "freezeTimer", questionIndex: game.questionIndex });
      setToast("❄️ Timer frozen for 10s!");
      setTimeout(() => setToast(null), 2000);
    }
    useGameStore.getState().usePowerup(type);
  };

  if (!game.currentQuestion) {
    return (
      <div className="screen">
        <div className="glass-card">
          <p>Loading question...</p>
        </div>
      </div>
    );
  }

  const progress = game.totalQuestions > 0 ? ((game.questionIndex + 1) / game.totalQuestions) * 100 : 0;

  return (
    <div className="screen">
      <div className="glass-card" style={{ maxWidth: 600 }}>
        <AnimatePresence>
          {toast && (
            <motion.div
              className="toast"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>
          <span>Question {game.questionIndex + 1} / {game.totalQuestions}</span>
          <span>Score: {game.score}</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {game.streak >= 2 && (
          <motion.div
            className={`streak-badge ${game.streak >= 3 ? "fire" : ""}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={game.streak}
          >
            🔥 {game.streak}x Streak {game.multiplier > 1 ? `(${game.multiplier}x points)` : ""}
          </motion.div>
        )}

        <div className={`timer-display ${timeLeft <= 5 ? "timer-warning" : ""}`}>
          ⏱️ {timeLeft}s
        </div>

        <motion.h2
          key={game.questionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ fontSize: 20, marginBottom: 16, lineHeight: 1.4 }}
        >
          {game.currentQuestion.question}
        </motion.h2>

        {!game.showResult && (
          <div className="powerups-bar">
            <button
              className={`powerup-btn ${!game.powerups.fiftyFifty ? "disabled" : ""}`}
              onClick={() => handlePowerup("fiftyFifty")}
              disabled={!game.powerups.fiftyFifty || game.answerSubmitted}
              title="50-50: Remove 2 wrong answers"
            >
              🎯
            </button>
            <button
              className={`powerup-btn ${!game.powerups.doublePoints ? "disabled" : ""}`}
              onClick={() => handlePowerup("doublePoints")}
              disabled={!game.powerups.doublePoints || game.answerSubmitted}
              title="Double Points: 2x on next correct answer"
            >
              ⚡
            </button>
            <button
              className={`powerup-btn ${!game.powerups.freezeTimer ? "disabled" : ""}`}
              onClick={() => handlePowerup("freezeTimer")}
              disabled={!game.powerups.freezeTimer || game.answerSubmitted}
              title="Freeze Timer: +10 seconds"
            >
              ❄️
            </button>
          </div>
        )}

        <div className="answers-grid">
          {game.currentQuestion.options.map((option, i) => {
            let className = "answer-btn";
            if (game.eliminatedOptions.includes(option)) className += " eliminated";
            else if (game.showResult && option === game.correctAnswer) className += " correct";
            else if (game.showResult && option === game.selectedAnswer && !game.isCorrect) className += " wrong";
            else if (option === game.selectedAnswer) className += " selected";

            return (
              <motion.button
                key={`${game.questionIndex}-${i}`}
                className={className}
                onClick={() => handleAnswer(option)}
                disabled={game.answerSubmitted || game.showResult || game.eliminatedOptions.includes(option)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <span style={{ opacity: 0.5, marginRight: 10 }}>{String.fromCharCode(65 + i)}</span>
                {option}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {game.showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                padding: 16,
                borderRadius: 14,
                background: game.isCorrect ? "rgba(0, 230, 118, 0.15)" : "rgba(255, 82, 82, 0.15)",
                border: `1px solid ${game.isCorrect ? "var(--correct-green)" : "var(--wrong-red)"}`,
                marginTop: 12,
              }}
            >
              <p style={{ fontSize: 18, fontWeight: 700, margin: 0, color: game.isCorrect ? "var(--correct-green)" : "var(--wrong-red)" }}>
                {game.isCorrect ? "✅ Correct!" : "❌ Wrong!"}
              </p>
              {!game.isCorrect && (
                <p style={{ fontSize: 14, margin: "4px 0 0 0", color: "var(--text-secondary)" }}>
                  Correct answer: {game.correctAnswer}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {opponentAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: 13, color: "var(--accent-cyan)", marginTop: 8 }}
            >
              ⚔️ {opponentAnswered}
            </motion.div>
          )}
        </AnimatePresence>

        {game.showResult && (
          <div style={{ marginTop: 16 }}>
            <button className="btn-primary" onClick={handleNextQuestion}>
              {game.questionIndex + 1 < game.totalQuestions ? "Next Question →" : "See Results 🏆"}
            </button>
          </div>
        )}

        <AnimatePresence>
          {showLeaderboard && game.leaderboard.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginTop: 20 }}
            >
              <h3>📊 Live Standings</h3>
              {game.leaderboard.slice(0, 5).map((p, i) => (
                <div className={`leaderboard-row rank-${i + 1}`} key={i}>
                  <span className="leaderboard-rank">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                  <span className="leaderboard-name">{p.username}</span>
                  <span className="leaderboard-score">{p.score}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
