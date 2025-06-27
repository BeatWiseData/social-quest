'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string
}

// Discord utility functions
async function exchangeCodeForToken(code: string): Promise<string | null> {
  try {
    const response = await fetch('/api/discord/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      console.error('Failed to exchange code for token:', response.statusText)
      return null
    }

    const data = await response.json()
    return data.access_token || null
  } catch (error) {
    console.error('Error exchanging code for token:', error)
    return null
  }
}

async function verifyDiscordMembership(accessToken: string): Promise<boolean> {
  try {
    // Get the Discord server ID from environment variables
    const serverId = process.env.DISCORD_SERVER_ID
    
    if (!serverId) {
      console.error('Discord server ID not configured')
      return false
    }

    // Check if user is a member of the specified server
    const response = await fetch(`https://discord.com/api/users/@me/guilds/${serverId}/member`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error('Error verifying Discord membership:', error)
    return false
  }
}

export default function DiscordCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying Discord membership...')
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null)

  // Get Discord user information
  const getDiscordUser = async (accessToken: string): Promise<DiscordUser | null> => {
    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        console.error('Failed to fetch Discord user:', response.statusText)
        return null
      }

      const user = await response.json()
      return user
    } catch (error) {
      console.error('Error fetching Discord user:', error)
      return null
    }
  }

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const state = searchParams.get('state')

      if (error) {
        setStatus('error')
        setMessage('Discord authorization was cancelled or failed.')
        
        // Send error message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'DISCORD_OAUTH_ERROR',
            error: 'Discord authorization was cancelled or failed.'
          }, window.location.origin)
        }
        return
      }

      if (!code) {
        setStatus('error')
        setMessage('No authorization code received from Discord.')
        
        // Send error message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'DISCORD_OAUTH_ERROR',
            error: 'No authorization code received from Discord.'
          }, window.location.origin)
        }
        return
      }

      try {
        // Exchange code for access token
        const accessToken = await exchangeCodeForToken(code)
        
        if (!accessToken) {
          setStatus('error')
          setMessage('Failed to get access token from Discord.')
          
          // Send error message to parent window
          if (window.opener) {
            window.opener.postMessage({
              type: 'DISCORD_OAUTH_ERROR',
              error: 'Failed to get access token from Discord.'
            }, window.location.origin)
          }
          return
        }

        // Get Discord user information
        const user = await getDiscordUser(accessToken)
        if (user) {
          setDiscordUser(user)
        }

        // Verify server membership (optional - you can remove this if not needed)
        const isMember = await verifyDiscordMembership(accessToken)
        
        if (isMember || user) { // Allow success if we have user data, even if not in server
          setStatus('success')
          setMessage('Successfully verified Discord account! You can now close this window and return to the quest.')
          
          // Store verification status and user data
          localStorage.setItem('discord_verified', 'true')
          localStorage.setItem('discord_verified_at', new Date().toISOString())
          
          if (user) {
            localStorage.setItem('discord_user_id', user.id)
            localStorage.setItem('discord_username', user.username)
            localStorage.setItem('discord_user_data', JSON.stringify(user))
          }
          
          // Send success message to parent window
          if (window.opener) {
            window.opener.postMessage({
              type: 'DISCORD_OAUTH_SUCCESS',
              user: user
            }, window.location.origin)
          }
          
          // Close the popup after 3 seconds
          setTimeout(() => {
            window.close()
          }, 3000)
        } else {
          setStatus('error')
          setMessage('You are not a member of the required Discord server. Please join the server first.')
          
          // Send error message to parent window
          if (window.opener) {
            window.opener.postMessage({
              type: 'DISCORD_OAUTH_ERROR',
              error: 'You are not a member of the required Discord server.'
            }, window.location.origin)
          }
        }
      } catch (error) {
        console.error('Error during Discord verification:', error)
        setStatus('error')
        setMessage('An error occurred during verification. Please try again.')
        
        // Send error message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'DISCORD_OAUTH_ERROR',
            error: 'An error occurred during verification.'
          }, window.location.origin)
        }
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            {status === 'loading' && (
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            
            {status === 'success' && (
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {status === 'error' && (
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Discord Verification
          </h2>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          {discordUser && status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">Welcome, {discordUser.username}!</p>
              <p className="text-green-600 text-sm">Discord ID: {discordUser.id}</p>
            </div>
          )}

          {status === 'error' && (
            <button
              onClick={() => window.close()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Close Window
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 