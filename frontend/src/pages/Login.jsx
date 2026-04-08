import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Shield, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        toast.success('Welcome back to TechSentry!')
        navigate('/dashboard')
      } else {
        toast.error(result.error.message || 'Login failed')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-tech-bg flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 tech-grid-bg opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-tech-primary/5 via-transparent to-tech-secondary/5"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-tech-primary rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Shield className="w-16 h-16 text-tech-primary" />
                <motion.div
                  className="absolute inset-0 w-16 h-16 rounded-full border-2 border-tech-primary animate-pulse-ring"
                />
              </div>
            </div>
            <h1 className="text-3xl font-orbitron font-bold text-tech-text mb-2">
              Welcome Back
            </h1>
            <p className="text-tech-muted">
              Sign in to TechSentry Intelligence Platform
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-tech-text mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="tech-input"
                placeholder="your.email@organisation.gov"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-tech-text mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="tech-input pr-10"
                  placeholder="Enter your secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tech-muted hover:text-tech-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-tech-primary bg-tech-surface border-tech-border rounded focus:ring-tech-primary"
                />
                <span className="ml-2 text-sm text-tech-muted">Remember me</span>
              </label>
              <a href="#" className="text-sm text-tech-primary hover:text-tech-primary/80">
                Forgot password?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full tech-button-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-tech-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-tech-primary hover:text-tech-primary/80 font-medium">
                Request Access
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-tech-muted">
              Defence Research Intelligence Platform • Secure Access Required
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
