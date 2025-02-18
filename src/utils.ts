import type React from "react"
import { LEVEL_COLORS } from "./constants"

export const generateQuestion = (level: number) => {
  const colors = LEVEL_COLORS[level]
  const backgroundColor = colors[Math.floor(Math.random() * colors.length)]
  let textColor
  do {
    textColor = colors[Math.floor(Math.random() * colors.length)]
  } while (textColor === backgroundColor)

  const colorWord = colors[Math.floor(Math.random() * colors.length)]

  return {
    backgroundColor,
    textColor,
    colorWord,
    colorWordJP: {
      red: "赤",
      blue: "青",
      yellow: "黄",
      white: "白",
      black: "黒",
      orange: "橙",
      green: "緑",
      purple: "紫",
    }[colorWord],
    correctAnswer: colorWord,
  }
}

export const updateHighScore = (
  newScore: number,
  mode: "time" | "score" | null,
  setHighScoreTime: React.Dispatch<React.SetStateAction<number>>,
  setHighScoreEndless: React.Dispatch<React.SetStateAction<number>>,
) => {
  if (mode === "time" && newScore > Number.parseInt(localStorage.getItem("highScoreTime") || "0")) {
    localStorage.setItem("highScoreTime", newScore.toString())
    setHighScoreTime(newScore)
  } else if (mode === "score" && newScore > Number.parseInt(localStorage.getItem("highScoreEndless") || "0")) {
    localStorage.setItem("highScoreEndless", newScore.toString())
    setHighScoreEndless(newScore)
  }
}

