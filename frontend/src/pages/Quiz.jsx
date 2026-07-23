import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useUserStore from "../store/userStore";
import useGameStore from "../store/gameStore";
import socket from "../socket/service";

export default function Quiz() {
  const navigate = useNavigate();
  const { username, isHost, roomCode } = useUserStore();
  const {
    currentQuestion, questionIndex, totalQuestions,
    selectedAnswer, answerSubmitted, showResult, isCorrect,
    correctAnswer, score, streak, multiplier, powerups,
    eliminatedOptions, leaderboard, setTimeLeft,
  } = useGameStore();

  const [timeLeft, setTimeLeftLocal] = useState(15);
  const [toast, setToast] = useState(null);
  const [opponentAnswered, setOpponentAnswered] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeLeftLocal(15);
  }, [questionIndex]);

  useEffect(() => {
    if (showResult) {
      clearInterval(timerRef.current);
    }
  }, [showResult]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeftLocal((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!answerSubmitted) {
            socket.emit("submit-answer", {
              roomCode,
              questionIndex,
              answer: null,
              timeTaken: 0,
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [questionIndex, answerSubmitted]);

  useEffect(() => {
    const handleNewQuestion = (data) => {
      setShowLeaderboard(false);
      useGameStore.getState().setQuestion(
        data.question,
        data.questionIndex,
        data.totalQuestions
      );
      setTimeLeftLocal(data.timePerQuestion);
    };

    const handleAnswerResult = (data) => {
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

    const handleTimerUpdate = (data) => {
      setTimeLeftLocal(data.timeLeft);
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
    socket.on("timer-update", handleTimerUpdate);
    socket.on("time-warning", handleTimeWarning);
    socket.on("leaderboard-update", handleLeaderboardUpdate);
    socket.on("quiz-ended", handleQuizEnded);
    socket.on("powerup-used", handlePowerupUsed);
    socket.on("eliminated-options", handleEliminatedOptions);

    return () => {
      socket.off("new-question", handleNewQuestion);
      socket.off("answer-result", handleAnswerResult);
      socket.off("opponent-answered", handleOpponentAnswer);
      socket.off("timer-update", handleTimerUpdate);
      socket.off("time-warning", handleTimeWarning);
      socket.off("leaderboard-update", handleLeaderboardUpdate);
      socket.off("quiz-ended", handleQuizEnded);
      socket.off("powerup-used", handlePowerupUsed);
      socket.off("eliminated-options", handleEliminatedOptions);
    };
  }, [navigate, username]);

  const handleAnswer = (answer) => {
    if (answerSubmitted || showResult) return;
    useGameStore.getState().setSelectedAnswer(answer);
    useGameStore.getState().setAnswerSubmitted(true);
    const timeTaken = (15 - timeLeft);
    socket.emit("submit-answer", {
      roomCode,
      questionIndex,
      answer,
      timeTaken,
    });
  };

  const handleNextQuestion = () => {
    if (isHost) {
      socket.emit("next-question", { roomCode });
    }
  };

  const handlePowerup = (type) => {
    if (!powerups[type]) return;
    if (type === "fiftyFifty") {
      socket.emit("use-powerup", { roomCode, type: "fiftyFifty", questionIndex });
    } else if (type === "doublePoints") {
      socket.emit("use-powerup", { roomCode, type: "doublePoints", questionIndex });
      setToast("⚡ Double Points activated!");
      setTimeout(() => setToast(null), 2000);
    } else if (type === "freezeTimer") {
      socket.emit("use-powerup", { roomCode, type: "freezeTimer", questionIndex });
      setToast("❄️ Timer frozen for 10s!");
      setTimeout(() => setToast(null), 2000);
    }
    useGameStore.getState().usePowerup(type);
  };

  if (!currentQuestion) {
    return (
      <div className="screen">
        <div className="glass-card">
          <p>Loading question...</p>
        </div>
      </div>
    );
  }

  const progress = totalQuestions > 0 ? ((questionIndex + 1) / totalQuestions) * 100 : 0;
  const timerPercent = (timeLeft / 15) * 100;

  return (
    <div className="screen">
      <div className="glass-card" style={{ maxWidth: 600 }}>
        {/* Toast */}
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

        {/* Progress */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>
          <span>Question {questionIndex + 1} / {totalQuestions}</span>
          <span>Score: {score}</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {/* Streak */}
        {streak >= 2 && (
          <motion.div
            className={`streak-badge ${streak >= 3 ? "fire" : ""}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={streak}
          >
            🔥 {streak}x Streak {multiplier > 1 ? `(${multiplier}x points)` : ""}
          </motion.div>
        )}

        {/* Timer */}
        <div className={`timer-display ${timeLeft <= 5 ? "timer-warning" : ""}`}>
          ⏱️ {timeLeft}s
        </div>

        {/* Question */}
        <motion.h2
          key={questionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ fontSize: 20, marginBottom: 16, lineHeight: 1.4 }}
        >
          {currentQuestion.question}
        </motion.h2>

        {/* Power-ups */}
        {!showResult && (
          <div className="powerups-bar">
            <button
              className={`powerup-btn ${!powerups.fiftyFifty ? "disabled" : ""}`}
              onClick={() => handlePowerup("fiftyFifty")}
              disabled={!powerups.fiftyFifty || answerSubmitted}
              title="50-50: Remove 2 wrong answers"
            >
              🎯
            </button>
            <button
              className={`powerup-btn ${!powerups.doublePoints ? "disabled" : ""}`}
              onClick={() => handlePowerup("doublePoints")}
              disabled={!powerups.doublePoints || answerSubmitted}
              title="Double Points: 2x on next correct answer"
            >
              ⚡
            </button>
            <button
              className={`powerup-btn ${!powerups.freezeTimer ? "disabled" : ""}`}
              onClick={() => handlePowerup("freezeTimer")}
              disabled={!powerups.freezeTimer || answerSubmitted}
              title="Freeze Timer: +10 seconds"
            >
              ❄️
            </button>
          </div>
        )}

        {/* Answers */}
        <div className="answers-grid">
          {currentQuestion.options.map((option, i) => {
            let className = "answer-btn";
            if (eliminatedOptions.includes(option)) className += " eliminated";
            else if (showResult && option === correctAnswer) className += " correct";
            else if (showResult && option === selectedAnswer && !isCorrect) className += " wrong";
            else if (option === selectedAnswer) className += " selected";

            return (
              <motion.button
                key={`${questionIndex}-${i}`}
                className={className}
                onClick={() => handleAnswer(option)}
                disabled={answerSubmitted || showResult || eliminatedOptions.includes(option)}
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

        {/* Result Feedback */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                padding: 16,
                borderRadius: 14,
                background: isCorrect ? "rgba(0, 230, 118, 0.15)" : "rgba(255, 82, 82, 0.15)",
                border: `1px solid ${isCorrect ? "var(--correct-green)" : "var(--wrong-red)"}`,
                marginTop: 12,
              }}
            >
              <p style={{ fontSize: 18, fontWeight: 700, margin: 0, color: isCorrect ? "var(--correct-green)" : "var(--wrong-red)" }}>
                {isCorrect ? "✅ Correct!" : "❌ Wrong!"}
              </p>
              {!isCorrect && (
                <p style={{ fontSize: 14, margin: "4px 0 0 0", color: "var(--text-secondary)" }}>
                  Correct answer: {correctAnswer}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Opponent answered toast */}
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

        {/* Next / Waiting */}
        {showResult && (
          <div style={{ marginTop: 16 }}>
            {isHost ? (
              <button className="btn-primary" onClick={handleNextQuestion}>
                {questionIndex + 1 < totalQuestions ? "Next Question →" : "See Results 🏆"}
              </button>
            ) : (
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                Waiting for host to continue...
              </p>
            )}
          </div>
        )}

        {/* Live Leaderboard */}
        <AnimatePresence>
          {showLeaderboard && leaderboard.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginTop: 20 }}
            >
              <h3>📊 Live Standings</h3>
              {leaderboard.slice(0, 5).map((p, i) => (
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
