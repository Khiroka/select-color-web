"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { COLORS, LEVEL_COLORS } from "./constants"
import { generateQuestion, updateHighScore } from "./utils"
import styles from "./styles"

type Question = {
  backgroundColor: keyof typeof COLORS;
  textColor: keyof typeof COLORS;
  colorWordJP: string;
  correctAnswer: string;
};

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState<"time" | "score" | null>(null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionTimer, setQuestionTimer] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [highScoreTime, setHighScoreTime] = useState(0);
  const [highScoreEndless, setHighScoreEndless] = useState(0);

  // Load high scores
  useEffect(() => {
    const timeScore = localStorage.getItem("highScoreTime")
    const endlessScore = localStorage.getItem("highScoreEndless")
    setHighScoreTime(timeScore ? Number.parseInt(timeScore) : 0)
    setHighScoreEndless(endlessScore ? Number.parseInt(endlessScore) : 0)
  }, [])

  // Game start
  const startGame = (mode: "time" | "score") => {
    setGameMode(mode)
    setGameStarted(true)
    setScore(0)
    setGameOver(false)
    setTimeLeft(mode === "time" ? 60 : Number.POSITIVE_INFINITY)
    setCurrentQuestion(generateQuestion(level))
    setQuestionTimer(5)
  }

  // Answer handling
  const handleAnswer = (selectedColor: string) => {
    if (currentQuestion && currentQuestion.correctAnswer === selectedColor) {
      setScore((prev) => prev + 1)
    } else if (gameMode === "score") {
      setGameOver(true)
      return
    }
    setCurrentQuestion(generateQuestion(level))
    setQuestionTimer(5)
  }

  // Timer logic
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setQuestionTimer((prev) => {
          if (prev <= 1) {
            if (gameMode === "score") {
              setGameOver(true)
            } else {
              setCurrentQuestion(generateQuestion(level))
              return 5
            }
          }
          return prev - 1
        })

        if (gameMode === "time") {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setGameOver(true)
              return 0
            }
            return prev - 1
          })
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameStarted, gameOver, gameMode, level])

  // Update high score on game over
  useEffect(() => {
    if (gameOver) {
      updateHighScore(score, gameMode, setHighScoreTime, setHighScoreEndless)
    }
  }, [gameOver, score, gameMode])

  if (!gameStarted || gameOver) {
    return (
      <div style={styles.container}>
        <div style={styles.background}>
          <h1 style={styles.title}>{gameOver ? `Game Over! Score: ${score}` : "Select Color"}</h1>
          {!gameStarted && (
            <>
              <div style={styles.highScoreContainer}>
                <h2 style={styles.highScoreTitle}>High Scores</h2>
                <p style={styles.highScoreText}>スコアタック: {highScoreEndless}</p>
                <p style={styles.highScoreText}>60秒チャレンジ: {highScoreTime}</p>
              </div>
              <div style={styles.levelSelector}>
                <span style={styles.levelText}>Level: {level}</span>
                <button style={styles.levelButton} onClick={() => setLevel((prev) => Math.max(1, prev - 1))}>
                  -
                </button>
                <button style={styles.levelButton} onClick={() => setLevel((prev) => Math.min(3, prev + 1))}>
                  +
                </button>
              </div>
              <div style={styles.playButton}>
              <button style={styles.startButton} onClick={() => startGame("score")}>
                スコアアタック
              </button>
              <button style={styles.startButton} onClick={() => startGame("time")}>
                60秒チャレンジ
              </button>
              </div>
            </>
          )}
          {gameOver && (
            <button style={styles.startButton} onClick={() => { setGameStarted(false); setGameOver(false); }}>
              Back to Menu
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.exitButton} onClick={() => setGameStarted(false)}>
         終了
        </button>
        <span style={styles.scoreText}>Score: {score}</span>
        <span style={styles.timeText}>{gameMode === "time" ? `Time: ${timeLeft}s` : `Time: ${questionTimer}s`}</span>
      </div>
      {currentQuestion && (
        <div style={{ ...styles.card, backgroundColor: COLORS[currentQuestion.backgroundColor] }}>
          <span style={{ ...styles.cardText, color: COLORS[currentQuestion.textColor] }}>
            {currentQuestion.colorWordJP}
          </span>
        </div>
      )}
      <div style={styles.buttonContainer}>
        {LEVEL_COLORS[level as keyof typeof LEVEL_COLORS].map((color) => (
            <button
              key={color}
              style={{ ...styles.colorButton, backgroundColor: COLORS[color] }}
              onClick={() => handleAnswer(color)}
            />
          ))}
      </div>
    </div>
  )
}

export default App
