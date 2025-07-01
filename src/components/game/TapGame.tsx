import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'

interface TapGameProps {
  onClose: () => void
  onGameComplete?: (score: number) => void
  userHighScore?: number
}

export const TapGame: React.FC<TapGameProps> = ({ onClose, onGameComplete, userHighScore = 0 }) => {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [highScore, setHighScore] = useState(userHighScore)
  const scoreRef = useRef(0)
  const hasCompletedRef = useRef(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && !hasCompletedRef.current) {
      setIsPlaying(false)
      hasCompletedRef.current = true
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current)
      }
      if (onGameComplete) {
        onGameComplete(scoreRef.current)
      }
    }
    return () => clearTimeout(timer)
  }, [isPlaying, timeLeft, highScore])

  const handleTap = () => {
    if (isPlaying) {
      const newScore = score + 1
      setScore(newScore)
      scoreRef.current = newScore
    }
  }

  const startGame = () => {
    setScore(0)
    scoreRef.current = 0
    setTimeLeft(30)
    setIsPlaying(true)
    hasCompletedRef.current = false
  }

  const resetGame = () => {
    setScore(0)
    scoreRef.current = 0
    setTimeLeft(30)
    setIsPlaying(false)
    hasCompletedRef.current = false
  }

  return (
    <div className="text-center">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Tap Tap Game</h3>
        <p className="text-gray-600">Tap as fast as you can in 30 seconds!</p>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="text-sm text-gray-600">Score</p>
          <p className="text-xl font-bold text-gray-900">{score}</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="text-sm text-gray-600">Time</p>
          <p className="text-xl font-bold text-gray-900">{timeLeft}s</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="text-sm text-gray-600">HighScore</p>
          <p className="text-xl font-bold text-gray-900">{highScore}</p>
        </div>
      </div>

      {/* Game Area */}
      <div className="mb-6">
        {isPlaying ? (
          <div
            onClick={handleTap}
            className="w-48 h-48 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-150 active:scale-95 shadow-lg"
          >
            <span className="text-white text-4xl font-bold">TAP!</span>
          </div>
        ) : (
          <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-xl">Game Over</span>
          </div>
        )}
      </div>

      {/* Game Controls */}
      <div className="space-y-3">
        {!isPlaying && timeLeft === 30 ? (
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={startGame}
          >
            Start Game
          </Button>
        ) : !isPlaying && timeLeft === 0 ? (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">Final Score: {score}</p>
              {score > highScore && (
                <p className="text-green-600 text-sm">New High Score! 🎉</p>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={startGame}
              >
                Play Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={resetGame}
              >
                Reset
              </Button>
            </div>
          </div>
        ) : null}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
        >
          Close Game
        </Button>
      </div>
    </div>
  )
}

export default TapGame 