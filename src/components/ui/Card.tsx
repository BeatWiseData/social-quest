import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300'
  const clickableClasses = props.onClick ? 'cursor-pointer hover:scale-105 transition-transform duration-300' : ''
  
  const cardClasses = `${baseClasses} ${clickableClasses} ${className}`

  return (
    <div
      className={cardClasses}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card