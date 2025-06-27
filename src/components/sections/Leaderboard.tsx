import React from 'react'
import { LeaderboardEntry } from '@/lib/types'
import { Card } from '@/components/ui/Card'
import { formatAddress, formatPoints, getRankIcon } from '@/lib/utils'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Leaderboard</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Rank</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Wallet Address</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">Total Points</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.rank} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <span className="text-lg">{getRankIcon(entry.rank)}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {formatAddress(entry.walletAddress)}
                  </code>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {entry.name.charAt(0)}
                    </div>
                    <span className="font-medium">{entry.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    {formatPoints(entry.totalPoints)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default Leaderboard