'use client'

import React, { useState } from 'react'
import Header from '@/components/layout/Header'
import Banner from '@/components/sections/Banner'
import QuestGrid from '@/components/quest/QuestGrid'
import QuestModal from '@/components/quest/QuestModal'
import StatsSection from '@/components/sections/StatsSection'
import Leaderboard from '@/components/sections/Leaderboard'
import { quests } from '@/data/mockData'
import { Quest } from '@/lib/types'

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null)

  const handleBeginQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId)
    if (quest) {
      setSelectedQuest(quest)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedQuest(null)
  }

  const handleVerifyQuest = (questId: string) => {
    console.log(`Quest verified: ${questId}`)
    // Add your verification logic here
    // This could include API calls to verify the user actually followed
    // and then award points
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Banner />
        <QuestGrid 
          quests={quests} 
          onBeginQuest={handleBeginQuest}
        />
        <StatsSection />
        <Leaderboard />
      </main>

      <QuestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        quest={selectedQuest}
        onVerify={handleVerifyQuest}
      />
    </div>
  )
}