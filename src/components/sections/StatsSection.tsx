import React, { memo, useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { useUserProfile } from '@/lib/hooks/useUserProfile'

const StatCard = memo(({ label, value }: { label: string; value: number }) => {
  const [displayValue, setDisplayValue] = useState<number>(value || 0)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (value !== displayValue) {
      setIsUpdating(true)
      setDisplayValue(value || 0)

      // Remove updating class after animation
      const timer = setTimeout(() => {
        setIsUpdating(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [value, displayValue])

  return (
    <Card className="text-center stat-card transition-all duration-300 ease-in-out">
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <p className={`text-2xl font-bold text-gray-900 stat-value ${isUpdating ? 'updating' : ''}`}>
        {(displayValue || 0).toLocaleString()}
      </p>
    </Card>
  )
})

StatCard.displayName = 'StatCard'

export const StatsSection: React.FC = () => {
  const { profile, loading, error } = useUserProfile()

  console.log('📈 StatsSection render:', { profile, loading, error })

  if (loading && !profile) {
    console.log('🔄 Showing loading state')
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="text-center stat-card">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error && !profile) {
    console.log('❌ Showing error state:', error)
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Stats</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading stats: {error}</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    console.log('🚫 No profile data available')
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Stats</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600">Connect your wallet to view your stats</p>
        </div>
      </div>
    )
  }

  console.log('✅ Profile data received:', profile)

  const statItems = [
    { label: 'Social Points', value: profile.socialPoints || 0 },
    { label: 'Game Points', value: profile.gamePoints || 0 },
    { label: 'Total Points', value: profile.totalPoints || 0 }
  ]

  console.log('📊 Stat items:', statItems)

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">My Stats</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <StatCard key={index} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  )
}

export default StatsSection