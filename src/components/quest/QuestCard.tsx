import React from 'react'
import { Quest } from '@/lib/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PlatformIcon } from '@/components/ui/PlatformIcon'
import { getPlatformGradient } from '@/lib/utils'

interface QuestCardProps {
  quest: Quest
  onBeginQuest?: (questId: string) => void
}

export const QuestCard: React.FC<QuestCardProps> = ({ 
  quest, 
  onBeginQuest 
}) => {
  const handleBeginQuest = () => {
    onBeginQuest?.(quest.id)
  }

  return (
    <Card className="text-center relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${getPlatformGradient(quest.platform)} opacity-50`}></div>
      
      <div className="relative z-10">
        {/* Points Badge */}
        <div className="inline-flex items-center gap-2 bg-white bg-opacity-80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium mb-4">
          <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
          {quest.points} Points + {quest.bonus}
        </div>

        {/* Platform Icon */}
        <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-xl shadow-lg flex items-center justify-center">
          <PlatformIcon platform={quest.platform} />
        </div>

        {/* Quest Info */}
        <h3 className="font-semibold text-gray-800 mb-4">{quest.title}</h3>
        
        <Button 
          variant="primary" 
          size="sm" 
          className="w-full"
          onClick={handleBeginQuest}
        >
          Begin Quest
        </Button>
      </div>
    </Card>
  )
}

export default QuestCard