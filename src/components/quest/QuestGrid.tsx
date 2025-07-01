import React from 'react'
import { Quest } from '@/lib/types'
import { QuestCard } from './QuestCard'

interface QuestGridProps {
  quests: Quest[]
  onBeginQuest?: (questId: string) => void
}

export const QuestGrid: React.FC<QuestGridProps> = ({ 
  quests, 
  onBeginQuest 
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Quest</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quests.map((quest) => (
          <QuestCard 
            key={quest.id} 
            quest={quest}
            onBeginQuest={onBeginQuest}
          />
        ))}
      </div>
    </div>
  )
}

export default QuestGrid