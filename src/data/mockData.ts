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
    id: '2',
    platform: 'discord',
    title: 'Join Discord',
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
    name: 'Ghost',
    totalPoints: 42000
  },
  {
    rank: 2,
    walletAddress: '0x8c8_4ed2',
    name: 'PotatoM2',
    totalPoints: 28000
  },
  {
    rank: 3,
    walletAddress: '0x96c8dd8',
    name: 'Jack',
    totalPoints: 20000
  },
  {
    rank: 4,
    walletAddress: '0x8c8_2d29',
    name: 'Bruce7',
    totalPoints: 15000
  }
]

export const userStats: UserStats = {
  gamePoints: 0,
  highScore: 0,
  socialPoints: 0,
  totalPoints: 0
}