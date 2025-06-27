// API endpoints for quest verification and point awarding
export const API_ENDPOINTS = {
  VERIFY_QUEST: '/api/quests/verify',
  GET_USER_POINTS: '/api/user/points',
  GET_LEADERBOARD: '/api/leaderboard',
  WALLET_AUTH: 'http://localhost:5000/api/v1/auth/wallet'
}

// Quest verification request
export interface QuestVerificationRequest {
  questId: string
  platform: 'twitter' | 'discord' | 'telegram'
  walletAddress: string
  discordUserId?: string // For Discord verification
  discordUsername?: string // For Discord verification
  signature?: string // For wallet signature verification
}

// Quest verification response
export interface QuestVerificationResponse {
  success: boolean
  pointsAwarded: number
  totalPoints: number
  message: string
  error?: string
}

// Wallet authentication request
export interface WalletAuthRequest {
  walletAddress: string
  originalMessage: string
  signedMessage: string
}

// Wallet authentication response
export interface WalletAuthResponse {
  success: boolean
  message: string
  user?: any
  error?: string
}

// Send quest verification to backend
export const verifyQuestWithBackend = async (
  questId: string,
  platform: string,
  walletAddress: string,
  discordData?: { userId: string; username: string }
): Promise<QuestVerificationResponse> => {
  try {
    const requestData: QuestVerificationRequest = {
      questId,
      platform: platform as 'twitter' | 'discord' | 'telegram',
      walletAddress,
      ...(discordData && {
        discordUserId: discordData.userId,
        discordUsername: discordData.username
      })
    }

    const response = await fetch(API_ENDPOINTS.VERIFY_QUEST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error verifying quest with backend:', error)
    return {
      success: false,
      pointsAwarded: 0,
      totalPoints: 0,
      message: 'Failed to verify quest with backend',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get user points from backend
export const getUserPoints = async (walletAddress: string): Promise<number> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.GET_USER_POINTS}?wallet=${walletAddress}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.totalPoints || 0
  } catch (error) {
    console.error('Error fetching user points:', error)
    return 0
  }
}

// Get leaderboard from backend
export const getLeaderboard = async (): Promise<any[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.GET_LEADERBOARD)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.leaderboard || []
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
}

// Authenticate wallet with backend
export const authenticateWallet = async (
  walletAddress: string,
  originalMessage: string,
  signedMessage: string
): Promise<WalletAuthResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.WALLET_AUTH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress,
        originalMessage,
        signedMessage
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error authenticating wallet:', error)
    return {
      success: false,
      message: 'Failed to authenticate wallet',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
} 