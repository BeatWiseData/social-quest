import React from 'react'

export const Banner: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-500 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
      <div className="relative z-10 max-w-2xl">
        <h2 className="text-3xl font-bold mb-4">
          Engage, Share & Earn - Complete Social Quests & Get Rewarded!
        </h2>
        <p className="text-blue-100 text-lg">
          Join our community and start earning rewards by completing social media quests
        </p>
      </div>
      
      {/* Decorative clouds */}
      {/* <div className="absolute top-4 right-4 w-16 h-12 bg-white bg-opacity-20 rounded-full blur-sm"></div>
      <div className="absolute top-12 right-16 w-20 h-14 bg-white bg-opacity-15 rounded-full blur-sm"></div>
      <div className="absolute top-8 right-32 w-12 h-8 bg-white bg-opacity-25 rounded-full blur-sm"></div> */}
      
      {/* Character illustration placeholder */}
      {/* <div className="absolute right-8 bottom-0 w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
        <span className="text-4xl">👩‍💼</span>
      </div> */}
    </div>
  )
}

export default Banner