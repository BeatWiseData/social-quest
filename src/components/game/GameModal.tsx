import React, { useState, useCallback } from 'react'
import { Modal } from '@/components/ui/Modal'
import { TapGame } from './TapGame'
import { updateUserStatsWithGamePoints } from '@/lib/utils'
import { UserStats } from '@/lib/types'
import { useAccount } from 'wagmi'
import { useUserProfile } from '@/lib/hooks/useUserProfile'
import { sendGamePoints } from '@/lib/api'

interface GameModalProps {
  isOpen: boolean
  onClose: () => void
  userStats?: UserStats
  onStatsUpdate?: (newStats: UserStats) => void
}

export const GameModal: React.FC<GameModalProps> = ({
  isOpen,
  onClose,
  userStats,
  onStatsUpdate
}) => {
  const { address } = useAccount()
  const { profile } = useUserProfile()
  const [currentStats, setCurrentStats] = useState<UserStats>(
    userStats || {
      gamePoints: 0,
      highScore: profile?.highScore || 0,
      socialPoints: 0,
      totalPoints: 0
    }
  )
  const [isSendingPoints, setIsSendingPoints] = useState(false)

  const sendGamePointsToServer = async (walletAddress: string, gamePoints: number) => {
    try {
      const data = await sendGamePoints(walletAddress, gamePoints)
      console.log('Game points sent to server:', data)
      return data
    } catch (error) {
      console.error('Error sending game points to server:', error)
      throw error
    }
  }

  const handleGameComplete = useCallback(async (score: number) => {
    // Prevent multiple requests
    if (isSendingPoints) {
      console.log('Already sending points, skipping duplicate request')
      return
    }

    setIsSendingPoints(true)

    try {
      // Convert game score to points (1 point per tap)
      const gamePointsEarned = score

      // Send game points to server if wallet is connected
      if (address) {
        try {
          await sendGamePointsToServer(address, gamePointsEarned)
          console.log(`Successfully sent ${gamePointsEarned} game points to server for wallet: ${address}`)
        } catch (error) {
          console.error('Failed to send game points to server:', error)
          // Continue with local stats update even if server call fails
        }
      } else {
        console.log('No wallet connected, skipping server update')
      }

      // Update user stats with accumulated game points
      const updatedStats = updateUserStatsWithGamePoints(
        {
          gamePoints: currentStats.gamePoints,
          highScore: currentStats.highScore,
          socialPoints: currentStats.socialPoints
        },
        gamePointsEarned
      )

      setCurrentStats(updatedStats)

      // Notify parent component of stats update
      if (onStatsUpdate) {
        onStatsUpdate(updatedStats)
      }

      console.log(`Game completed! Earned ${gamePointsEarned} game points. Total game points: ${updatedStats.gamePoints}, High score: ${updatedStats.highScore}`)
    } finally {
      setIsSendingPoints(false)
    }
  }, [isSendingPoints, address, currentStats, onStatsUpdate])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mini Game"
    >
      <TapGame 
        onClose={onClose} 
        onGameComplete={handleGameComplete} 
        userHighScore={profile?.highScore || 0}
      />
    </Modal>
  )
}

export default GameModal 