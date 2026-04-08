import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, FileText, Users, Activity, Clock, ArrowUp, ArrowDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Logo from '../components/Layout/Logo'

const keywordCategories = [
  { name: 'AI & ML', keywords: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'Reinforcement Learning', 'Edge AI', 'Federated Learning'] },
  { name: 'Quantum Tech', keywords: ['Quantum Computing', 'Quantum Cryptography', 'Quantum Sensors', 'Quantum Communications'] },
  { name: 'Hypersonics', keywords: ['Hypersonic Missiles', 'Scramjet', 'Hypersonic Glide', 'Thermal Protection'] },
  { name: 'Cyber Security', keywords: ['Network Security', 'Cryptography', 'Threat Detection', 'Zero Trust', 'Quantum Cryptography'] },
  { name: 'Space Tech', keywords: ['Satellite Systems', 'Space Launch', 'Orbital Mechanics', 'Space Debris'] },
  { name: 'Robotics', keywords: ['Autonomous Systems', 'Human-Robot Interaction', 'Swarm Robotics', 'Exoskeletons'] },
  { name: 'Semiconductors', keywords: ['Chip Design', 'Quantum Dots', 'Photonic Computing', 'Neuromorphic'] },
  { name: 'Biotech', keywords: ['Synthetic Biology', 'Bioinformatics', 'Medical Countermeasures', 'DNA Computing'] },
  { name: 'Energy', keywords: ['Nuclear Fusion', 'Battery Technology', 'Solar Cells', 'Energy Storage'] },
  { name: 'Communications', keywords: ['5G/6G', 'Quantum Communications', 'SATCOM', 'Secure Communications'] }
]

const featuredTechnologies = [
  { name: 'Quantum Radar', trl: 3, papers: 1247, trend: 'up', trendPercent: 23 },
  { name: 'Hypersonic Missiles', trl: 7, papers: 3421, trend: 'up', trendPercent: 15 },
  { name: 'AI in Defence', trl: 6, papers: 8932, trend: 'up', trendPercent: 41 }
]

const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime = null
    const startValue = 0
    const endValue = value

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      
      setCount(Math.floor(progress * (endValue - startValue) + startValue))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, duration])

  return <span>{count.toLocaleString()}</span>
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedKeyword, setSelectedKeyword] = useState('')

  // Mock data for demonstration
  const stats = {
    totalPapers: 2847392,
    patentsTracked: 892341,
    technologiesMonitored: 1847,
    lastUpdated: new Date()
  }

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category)
  }

  const handleKeywordClick = (keyword) => {
    setSearchQuery(keyword)
    setSelectedKeyword(keyword)
    handleSearch(keyword)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Logo size="large" showTagline={true} />
        </div>
        <h1 className="text-4xl font-orbitron font-bold text-tech-text mb-2">
          Technology Intelligence Dashboard
        </h1>
        <p className="text-tech-muted text-lg">
          Defence Research • Advanced Technology Analysis
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Papers Indexed', value: stats.totalPapers, icon: FileText, color: 'tech-primary' },
          { label: 'Patents Tracked', value: stats.patentsTracked, icon: TrendingUp, color: 'tech-secondary' },
          { label: 'Technologies Monitored', value: stats.technologiesMonitored, icon: Activity, color: 'tech-success' },
          { label: 'Last Updated', value: stats.lastUpdated, icon: Clock, color: 'tech-muted', isDate: true }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="tech-card-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tech-muted text-sm mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold font-jetbrains text-${stat.color}`}>
                  {stat.isDate ? (
                    new Date(stat.value).toLocaleDateString()
                  ) : (
                    <AnimatedCounter value={stat.value} />
                  )}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="tech-card text-center"
      >
        <h2 className="text-2xl font-orbitron font-bold text-tech-text mb-6">
          Technology Search Intelligence
        </h2>
        
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tech-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              placeholder="Search any technology... e.g. Quantum Radar, Hypersonic Missiles, AI in Defence"
              className="w-full pl-12 pr-4 py-4 text-lg tech-input"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSearch(searchQuery)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 tech-button-primary px-6 py-2"
            >
              Search
            </motion.button>
          </div>
        </div>

        {/* Keyword Categories */}
        <div className="mb-6">
          <p className="text-tech-muted mb-4">Quick Access Categories:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {keywordCategories.map((category) => (
              <motion.button
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-tech-primary text-black'
                    : 'bg-tech-surface border border-tech-border text-tech-muted hover:text-tech-text hover:border-tech-primary'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Keywords Dropdown */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="tech-card p-4">
              <p className="text-tech-muted mb-3">Specific Technologies:</p>
              <div className="flex flex-wrap gap-2">
                {selectedCategory.keywords.map((keyword) => (
                  <motion.button
                    key={keyword}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleKeywordClick(keyword)}
                    className="px-3 py-1 text-sm bg-tech-primary/10 text-tech-primary border border-tech-primary/30 rounded-full hover:bg-tech-primary/20 transition-all"
                  >
                    {keyword}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Featured Technologies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-orbitron font-bold text-tech-text mb-6">
          Trending Technologies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTechnologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="tech-card-hover cursor-pointer"
              onClick={() => navigate(`/technology?q=${encodeURIComponent(tech.name)}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-orbitron font-semibold text-tech-text">
                    {tech.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      tech.trl <= 3 ? 'bg-red-500/20 text-red-400' :
                      tech.trl <= 6 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      TRL {tech.trl}
                    </span>
                    <div className="flex items-center text-sm text-tech-muted">
                      <FileText className="w-3 h-3 mr-1" />
                      <AnimatedCounter value={tech.papers} />
                    </div>
                  </div>
                </div>
                <div className={`flex items-center text-sm ${
                  tech.trend === 'up' ? 'text-tech-success' : 'text-tech-secondary'
                }`}>
                  {tech.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {tech.trendPercent}%
                </div>
              </div>
              <div className="text-tech-muted text-sm">
                High research activity with growing defence applications
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
