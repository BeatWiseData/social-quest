import { Quest, LeaderboardEntry, UserStats } from '@/lib/types'

export const quests: Quest[] = [
  {
    id: '1',
    platform: 'twitter',
    title: 'Join X',
    points: 100,
    bonus: 1
  },
  {
    id: '3',
    platform: 'telegram',
    title: 'Join Telegram',
    points: 100,
    bonus: 1
  }
]

export const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    walletAddress: '0x8c8F24',
    totalPoints: 42000,
    gamePoints: 20000,
    referralPoints: 10000,
    socialPoints: 12000
  },
  {
    rank: 2,
    walletAddress: '0x8c8_4ed2',
    totalPoints: 28000,
    gamePoints: 15000,
    referralPoints: 8000,
    socialPoints: 5000
  },
  {
    rank: 3,
    walletAddress: '0x96c8dd8',
    totalPoints: 20000,
    gamePoints: 12000,
    referralPoints: 5000,
    socialPoints: 3000
  },
  {
    rank: 4,
    walletAddress: '0x8c8_2d29',
    totalPoints: 15000,
    gamePoints: 8000,
    referralPoints: 4000,
    socialPoints: 3000
  }
]

export const userStats: UserStats = {
  gamePoints: 0,
  highScore: 0,
  socialPoints: 0,
  totalPoints: 0
}