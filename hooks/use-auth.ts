'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

export function useAuth() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.login(username, password)
      localStorage.setItem('access_token', response.data.access_token)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      console.error('Login failed', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Continue with local logout even if server logout fails
    }
    
    localStorage.removeItem('access_token')
    setIsAuthenticated(false)
    router.push('/login')
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  }
} 