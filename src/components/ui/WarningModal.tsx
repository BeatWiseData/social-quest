import React from 'react'
import { Modal } from './Modal'
import { Button } from './Button'

interface WarningModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  onAction?: () => void
  actionText?: string
}

export const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onAction,
  actionText = 'Connect Wallet'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h4>
          <p className="text-gray-600">
            {message}
          </p>
        </div>

        <div className="space-y-3">
          {onAction && (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={onAction}
            >
              {actionText}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default WarningModal 