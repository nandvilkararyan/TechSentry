import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/profile/')
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login/', { email, password })
      const { user, tokens } = response.data
      
      localStorage.setItem('access_token', tokens.access)
      localStorage.setItem('refresh_token', tokens.refresh)
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`
      
      setUser(user)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || { message: 'Login failed' }
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register/', userData)
      const { user, tokens } = response.data
      
      localStorage.setItem('access_token', tokens.access)
      localStorage.setItem('refresh_token', tokens.refresh)
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`
      
      setUser(user)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || { message: 'Registration failed' }
      }
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        await axios.post('/api/auth/logout/', { refresh_token: refreshToken })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
    }
  }

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put('/api/auth/profile/', userData)
      setUser(response.data)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || { message: 'Profile update failed' }
      }
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
