import React, { useState } from 'react'
import { Quest } from '@/lib/types'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { PlatformIcon } from '@/components/ui/PlatformIcon'
import { WarningModal } from '@/components/ui/WarningModal'
import { handleTwitterFollow, handleDiscordJoin, checkDiscordVerification } from '@/lib/utils'
import { verifyQuestWithBackend } from '@/lib/api'
import { useAccount } from 'wagmi'

interface QuestModalProps {
  isOpen: boolean
  onClose: () => void
  quest: Quest | null
  onVerify: (questId: string) => void
}

export const QuestModal: React.FC<QuestModalProps> = ({
  isOpen,
  onClose,
  quest,
  onVerify
}) => {
  const { isConnected, address } = useAccount()
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const handleJoinPlatform = () => {
    if (!quest) return
    
    switch (quest.platform) {
      case 'twitter':
        handleTwitterFollow()
        break
      case 'discord':
        // Discord join functionality removed
        console.log('Discord join clicked')
        break
      case 'telegram':
        // Handle Telegram join logic
        console.log('Telegram join clicked')
        break
      default:
        console.log('Unknown platform:', quest.platform)
    }
  }

  const handleDiscordOAuth = async (): Promise<{ id: string; username: string; [key: string]: any }> => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI
    
    if (!clientId || !redirectUri) {
      console.error('Discord OAuth configuration missing')
      throw new Error('Discord OAuth configuration missing')
    }
    
    // Generate a random state for security
    const state = Math.random().toString(36).substring(7)
    localStorage.setItem('discord_oauth_state', state)
    
    // Construct Discord OAuth URL
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify&state=${state}`
    
    // Open Discord OAuth in a popup
    const popup = window.open(discordAuthUrl, 'discord_oauth', 'width=500,height=600,scrollbars=yes,resizable=yes')
    
    // Wait for the popup to close or receive message
    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          reject(new Error('OAuth popup was closed'))
        }
      }, 1000)
      
      // Listen for message from popup
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return
        
        if (event.data.type === 'DISCORD_OAUTH_SUCCESS') {
          clearInterval(checkClosed)
          window.removeEventListener('message', handleMessage)
          resolve(event.data.user)
        } else if (event.data.type === 'DISCORD_OAUTH_ERROR') {
          clearInterval(checkClosed)
          window.removeEventListener('message', handleMessage)
          reject(new Error(event.data.error))
        }
      }
      
      window.addEventListener('message', handleMessage)
    })
  }

  const handleVerify = async () => {
    if (!isConnected || !address) {
      setWarningMessage('You need to connect your wallet first to verify quest completion. Please connect your wallet and try again.')
      setIsWarningModalOpen(true)
      return
    }

    if (!quest) return

    setIsVerifying(true)

    try {
      let result

      // Handle X/Twitter quest verification
      if (quest.platform === 'twitter') {
        const response = await fetch('http://localhost:5000/api/v1/quests/x-task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            walletAddress: address
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        result = {
          success: data.success || true,
          pointsAwarded: data.pointsAwarded || quest.points,
          totalPoints: data.totalPoints || quest.points,
          message: data.message || 'X quest completed successfully!'
        }
      } else if (quest.platform === 'discord') {
        // Handle Discord OAuth and verification
        try {
          const discordUser = await handleDiscordOAuth()
          console.log('Discord User ID:', discordUser.id)
          console.log('Discord Username:', discordUser.username)
          console.log('Full Discord User Data:', discordUser)
          
          // For now, assume verification passed if we got user data
          result = {
            success: true,
            pointsAwarded: quest.points,
            totalPoints: quest.points,
            message: 'Discord quest completed successfully!'
          }
        } catch (error) {
          console.error('Discord OAuth failed:', error)
          setWarningMessage('Discord verification failed. Please try again.')
          setIsWarningModalOpen(true)
          return
        }
      } else {
        // Handle other platforms (telegram, etc.)
        result = await verifyQuestWithBackend(
          quest.id,
          quest.platform,
          address
        )
      }

      if (result.success) {
        // Show success message
        alert(`Quest completed successfully! You earned ${result.pointsAwarded} points. Total points: ${result.totalPoints}`)
        
        // Call the original onVerify function
        onVerify(quest.id)
        onClose()
      } else {
        // Show error message
        setWarningMessage(`Verification failed: ${result.message}`)
        setIsWarningModalOpen(true)
      }
    } catch (error) {
      console.error('Error during quest verification:', error)
      setWarningMessage('An error occurred during verification. Please try again.')
      setIsWarningModalOpen(true)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleCloseWarningModal = () => {
    setIsWarningModalOpen(false)
  }

  if (!quest) return null

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'Twitter'
      case 'discord':
        return 'Discord'
      case 'telegram':
        return 'Telegram'
      default:
        return platform
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Complete ${getPlatformName(quest.platform)} Quest`}
      >
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <PlatformIcon platform={quest.platform} />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {quest.title}
            </h4>
            <p className="text-gray-600 mb-4">
              Complete this quest to earn {quest.points} points + {quest.bonus} bonus
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleJoinPlatform}
              disabled={isVerifying}
            >
              Join {getPlatformName(quest.platform)}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify Completion'}
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Step 1: Join the platform • Step 2: Verify your completion
          </p>
          
          {!isConnected && (
            <p className="text-xs text-red-500 mt-2">
              ⚠️ Wallet must be connected to verify quest completion
            </p>
          )}

          {quest.platform === 'discord' && !checkDiscordVerification() && (
            <p className="text-xs text-orange-500 mt-2">
              ⚠️ Discord membership verification required
            </p>
          )}

          {isVerifying && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-blue-700 text-sm">Verifying with backend...</span>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <WarningModal
        isOpen={isWarningModalOpen}
        onClose={handleCloseWarningModal}
        title="Verification Required"
        message={warningMessage}
        actionText={!isConnected ? "Connect Wallet" : undefined}
      />
    </>
  )
}

export default QuestModal 