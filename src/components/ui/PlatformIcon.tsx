import React from 'react'
import { Platform } from '@/lib/types'

interface PlatformIconProps {
  platform: Platform
  className?: string
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ 
  platform, 
  className = '' 
}) => {
  const getIconPath = (platform: Platform) => {
    switch (platform) {
      case 'twitter':
        return '/x-logo.svg'
      case 'discord':
        return '/discord-logo.svg'
      case 'telegram':
        return '/telegram-logo.svg'
      default:
        return '/x-logo.svg'
    }
  }

  const getIconColor = (platform: Platform) => {
    switch (platform) {
      case 'twitter':
        return 'text-gray-900'
      case 'discord':
        return 'text-[#5865F2]'
      case 'telegram':
        return 'text-[#0088cc]'
      default:
        return 'text-gray-900'
    }
  }

  return (
    <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg ${className}`}>
      <img 
        src={getIconPath(platform)} 
        alt={`${platform} logo`}
        className={`w-6 h-6 ${getIconColor(platform)}`}
      />
    </div>
  )
}

export default PlatformIcon 