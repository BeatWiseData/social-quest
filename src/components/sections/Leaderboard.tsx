import React from 'react'
import { Card } from '@/components/ui/Card'
import { formatAddress, formatPoints } from '@/lib/utils'
import { useLeaderboard } from '@/lib/hooks/useLeaderboard'
import { useAccount } from 'wagmi'

export const Leaderboard: React.FC = () => {
  const { leaderboard, loading, error, refetch } = useLeaderboard()
  const { address } = useAccount()
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Leaderboard</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
                          <tr className="border-b border-gray-200">
                <th className="text-center py-3 px-4 font-medium text-gray-600">Rank</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Wallet Address</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Total Points</th>
              </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-500">
                  Loading leaderboard...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-red-500">
                  Error loading leaderboard: {error}
                </td>
              </tr>
            ) : leaderboard.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-500">
                  No leaderboard data available
                </td>
              </tr>
            ) : (
              leaderboard.map((entry) => {
                const isMyEntry = address && entry.walletAddress.toLowerCase() === address.toLowerCase()
                return (
                  <tr 
                    key={entry.rank} 
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      isMyEntry ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                                      <td className="py-4 px-4 text-center">
                    <span className={`text-lg font-semibold ${
                      isMyEntry ? 'text-blue-600' : 'text-gray-800'
                    }`}>
                      {entry.rank}
                    </span>
                  </td>
                    <td className="py-4 px-4 text-center">
                      <code className={`text-sm px-2 py-1 rounded ${
                        isMyEntry 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {formatAddress(entry.walletAddress)}
                      </code>
                    </td>
                                      <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                      isMyEntry 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {formatPoints(entry.totalPoints)}
                    </span>
                  </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default Leaderboard