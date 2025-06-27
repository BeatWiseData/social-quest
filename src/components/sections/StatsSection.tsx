import React from 'react'
import { UserStats } from '@/lib/types'
import { Card } from '@/components/ui/Card'

interface StatsSectionProps {
  stats: UserStats
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const statItems = [
    { label: 'Social Points', value: stats.socialPoints },
    { label: 'Game Points', value: stats.gamePoints },
    { label: 'Total Points', value: stats.totalPoints }
  ]

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">My Stats</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <Card key={index} className="text-center">
            <p className="text-sm text-gray-600 mb-2">{item.label}</p>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default StatsSection