import React, { useState } from 'react'
import { WalletOptions } from '../ui/WalletButton'
import { Button } from '../ui/Button'
import GameModal from '../game/GameModal'

export const Header: React.FC = () => {
  const [isGameModalOpen, setIsGameModalOpen] = useState(false)

  const handleGameClick = () => {
    setIsGameModalOpen(true)
  }

  const handleCloseGameModal = () => {
    setIsGameModalOpen(false)
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Social Questing
            </h1>
            <nav className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGameClick}
              >
                Game
              </Button>
              <WalletOptions />
            </nav>
          </div>
        </div>
      </header>

      <GameModal
        isOpen={isGameModalOpen}
        onClose={handleCloseGameModal}
      />
    </>
  )
}

export default Header