import React from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const InviteSection: React.FC = () => {
  return (
    <Card className="mb-8 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Invite & Earn 200 Rewards!
          </h3>
          <p className="text-gray-600 text-sm">
            👥 Invite your friends to X Layer and earn points for each!
          </p>
        </div>
        <Button variant="primary">
          Invite a Friend
        </Button>
      </div>
    </Card>
  )
}

export default InviteSection