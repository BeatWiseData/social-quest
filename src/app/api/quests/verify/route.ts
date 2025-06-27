import { NextRequest, NextResponse } from 'next/server'

interface QuestVerificationRequest {
  questId: string
  platform: 'twitter' | 'discord' | 'telegram'
  walletAddress: string
  discordUserId?: string
  discordUsername?: string
  signature?: string
}

interface QuestVerificationResponse {
  success: boolean
  pointsAwarded: number
  totalPoints: number
  message: string
  error?: string
}

// Mock database - replace with your actual database
const userPoints: Record<string, number> = {}
const completedQuests: Record<string, Set<string>> = {}

// Quest point values
const QUEST_POINTS: Record<string, number> = {
  '1': 100, // Twitter quest
  '2': 100, // Discord quest
  '3': 100  // Telegram quest
}

export async function POST(request: NextRequest) {
  try {
    const body: QuestVerificationRequest = await request.json()
    const { questId, platform, walletAddress, discordUserId, discordUsername } = body

    // Validate required fields
    if (!questId || !platform || !walletAddress) {
      return NextResponse.json(
        { 
          success: false, 
          pointsAwarded: 0, 
          totalPoints: 0, 
          message: 'Missing required fields' 
        },
        { status: 400 }
      )
    }

    // Check if user has already completed this quest
    if (!completedQuests[walletAddress]) {
      completedQuests[walletAddress] = new Set()
    }

    if (completedQuests[walletAddress].has(questId)) {
      return NextResponse.json(
        { 
          success: false, 
          pointsAwarded: 0, 
          totalPoints: userPoints[walletAddress] || 0, 
          message: 'Quest already completed' 
        },
        { status: 400 }
      )
    }

    // Platform-specific verification
    let verificationPassed = false

    switch (platform) {
      case 'discord':
        // Verify Discord membership
        if (discordUserId && discordUsername) {
          // Here you would typically verify with Discord API
          // For now, we'll assume verification passed if we have Discord data
          verificationPassed = true
          console.log(`Discord verification for user ${discordUsername} (${discordUserId})`)
        } else {
          return NextResponse.json(
            { 
              success: false, 
              pointsAwarded: 0, 
              totalPoints: userPoints[walletAddress] || 0, 
              message: 'Discord verification data missing' 
            },
            { status: 400 }
          )
        }
        break

      case 'twitter':
        // For Twitter, you might want to verify the follow status
        // For now, we'll assume verification passed
        verificationPassed = true
        console.log(`Twitter verification for wallet ${walletAddress}`)
        break

      case 'telegram':
        // For Telegram, you might want to verify the join status
        // For now, we'll assume verification passed
        verificationPassed = true
        console.log(`Telegram verification for wallet ${walletAddress}`)
        break

      default:
        return NextResponse.json(
          { 
            success: false, 
            pointsAwarded: 0, 
            totalPoints: userPoints[walletAddress] || 0, 
            message: 'Invalid platform' 
          },
          { status: 400 }
        )
    }

    if (!verificationPassed) {
      return NextResponse.json(
        { 
          success: false, 
          pointsAwarded: 0, 
          totalPoints: userPoints[walletAddress] || 0, 
          message: 'Verification failed' 
        },
        { status: 400 }
      )
    }

    // Award points
    const pointsToAward = QUEST_POINTS[questId] || 100
    const currentPoints = userPoints[walletAddress] || 0
    const newTotalPoints = currentPoints + pointsToAward

    // Update user points
    userPoints[walletAddress] = newTotalPoints

    // Mark quest as completed
    completedQuests[walletAddress].add(questId)

    // Log the completion
    console.log(`Quest ${questId} completed by ${walletAddress}. Points awarded: ${pointsToAward}. Total: ${newTotalPoints}`)

    // Return success response
    const response: QuestVerificationResponse = {
      success: true,
      pointsAwarded: pointsToAward,
      totalPoints: newTotalPoints,
      message: `Quest completed successfully! Earned ${pointsToAward} points.`
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in quest verification:', error)
    return NextResponse.json(
      { 
        success: false, 
        pointsAwarded: 0, 
        totalPoints: 0, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 