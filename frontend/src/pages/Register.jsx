import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Shield, User, Building, Briefcase } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const researchDomains = [
  'Artificial Intelligence & Machine Learning',
  'Quantum Technology',
  'Hypersonics',
  'Cyber Security',
  'Space Technology',
  'Robotics & Autonomous Systems',
  'Semiconductors',
  'Biotechnology',
  'Energy Systems',
  'Communications & Networking',
  'Materials Science',
  'Directed Energy Weapons'
]

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
    organization: '',
    designation: '',
    research_domains: []
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === 'password') {
      calculatePasswordStrength(value)
    }
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 12.5
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5
    setPasswordStrength(strength)
  }

  const handleDomainToggle = (domain) => {
    setFormData(prev => ({
      ...prev,
      research_domains: prev.research_domains.includes(domain)
        ? prev.research_domains.filter(d => d !== domain)
        : [...prev.research_domains, domain]
    }))
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500'
    if (passwordStrength < 60) return 'bg-yellow-500'
    if (passwordStrength < 80) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Weak'
    if (passwordStrength < 60) return 'Fair'
    if (passwordStrength < 80) return 'Good'
    return 'Strong'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (formData.password !== formData.password_confirm) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const result = await register(formData)
      if (result.success) {
        toast.success('Registration successful! Welcome to TechSentry.')
        navigate('/dashboard')
      } else {
        toast.error(result.error.message || 'Registration failed')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-tech-bg flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 tech-grid-bg opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-tech-primary/5 via-transparent to-tech-secondary/5"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl mx-4"
      >
        <div className="glass-effect rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
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
              Request Access
            </h1>
            <p className="text-tech-muted">
              Join the TechSentry Intelligence Platform
            </p>
          </div>

          {/* Registration form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tech-text mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="tech-input"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tech-text mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="tech-input"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="john.doe@organisation.gov"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tech-text mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="tech-input"
                  placeholder="johndoe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tech-text mb-2">
                  <Building className="inline w-4 h-4 mr-1" />
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                  className="tech-input"
                  placeholder="DRDO"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tech-text mb-2">
                  <Briefcase className="inline w-4 h-4 mr-1" />
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  className="tech-input"
                  placeholder="Research Scientist"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-tech-text mb-2">
                Research Domains (Select all that apply)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-tech-border rounded-lg bg-tech-surface">
                {researchDomains.map(domain => (
                  <label key={domain} className="flex items-center space-x-2 cursor-pointer hover:bg-tech-border/50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.research_domains.includes(domain)}
                      onChange={() => handleDomainToggle(domain)}
                      className="w-4 h-4 text-tech-primary bg-tech-surface border-tech-border rounded focus:ring-tech-primary"
                    />
                    <span className="text-sm text-tech-text">{domain}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tech-muted hover:text-tech-text"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-tech-muted">Password Strength</span>
                      <span className={getPasswordStrengthColor().replace('bg-', 'text-')}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-tech-border rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-tech-text mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    required
                    className="tech-input pr-10"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tech-muted hover:text-tech-text"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
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
                  <Shield className="w-4 h-4" />
                  <span>Request Access</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-tech-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-tech-primary hover:text-tech-primary/80 font-medium">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-tech-muted">
              Access requests are reviewed by security administrators
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
