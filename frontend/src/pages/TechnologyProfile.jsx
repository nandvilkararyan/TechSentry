import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  FileText, 
  Quote, 
  Building, 
  Newspaper,
  TrendingUp,
  Activity,
  Globe,
  Target,
  Zap
} from 'lucide-react'
import WordCloud from '../components/Charts/WordCloud'
import PaperModal from '../components/Modals/PaperModal'

const TechnologyProfile = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [selectedPaper, setSelectedPaper] = useState(null)

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['technology-profile', query],
    queryFn: async () => {
      if (!query) return null
      const response = await fetch(`/api/technology/profile/?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Failed to fetch technology profile')
      return response.json()
    },
    enabled: query.length > 0
  })

  if (!query) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-tech-muted mx-auto mb-4" />
        <h3 className="text-xl font-orbitron font-semibold text-tech-text mb-2">
          No Technology Selected
        </h3>
        <p className="text-tech-muted">
          Search for a technology or select one from your dashboard to view detailed analysis
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tech-primary mx-auto"></div>
        <p className="text-tech-muted mt-4">Analyzing technology...</p>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="text-center py-12">
        <p className="text-tech-muted">No data found for "{query}"</p>
      </div>
    )
  }

  const { stats, papers, patents, news, companies, analytics, summary } = profileData

  // Process data for charts
  const publicationData = Object.entries(analytics.papers_by_year || {}).map(([year, count]) => ({
    year: parseInt(year),
    papers: count,
    citations: Math.floor(count * Math.random() * 10) // Mock citation data
  }))

  const patentData = Object.entries(analytics.patents_by_year || {}).map(([year, count]) => ({
    year: parseInt(year),
    patents: count
  }))

  const trlData = [
    { name: 'TRL', value: stats.trl_level, fill: '#00D4FF' }
  ]

  const countryData = Object.entries(analytics.rd_countries || {}).slice(0, 10).map(([country, value]) => ({
    country,
    investment: value
  }))

  const assigneeData = Object.entries(analytics.top_assignees || {}).slice(0, 5).map(([assignee, count]) => ({
    assignee,
    patents: count
  }))

  const COLORS = ['#00D4FF', '#FF6B35', '#00FF94', '#FFD700', '#FF69B4']

  // Generate word cloud data from convergence analysis
  const wordCloudData = React.useMemo(() => {
    if (!analytics?.convergence) return []
    
    // Mock word cloud data based on technology
    const baseWords = [
      { text: query.toUpperCase(), frequency: 100 },
      { text: 'Artificial Intelligence', frequency: 85 },
      { text: 'Machine Learning', frequency: 75 },
      { text: 'Deep Learning', frequency: 70 },
      { text: 'Neural Networks', frequency: 65 },
      { text: 'Defense', frequency: 60 },
      { text: 'Military', frequency: 55 },
      { text: 'Security', frequency: 50 },
      { text: 'Innovation', frequency: 45 },
      { text: 'Research', frequency: 40 },
      { text: 'Development', frequency: 35 },
      { text: 'Technology', frequency: 30 },
      { text: 'Advanced', frequency: 25 },
      { text: 'Systems', frequency: 20 },
      { text: 'Applications', frequency: 15 }
    ]
    
    return baseWords.map(word => ({
      ...word,
      frequency: Math.max(10, word.frequency + Math.random() * 20 - 10)
    }))
  }, [analytics?.convergence, query])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-orbitron font-bold text-tech-text mb-2">
          {query}
        </h1>
        <p className="text-tech-muted text-lg">
          Comprehensive Technology Intelligence Analysis
        </p>
      </div>

      {/* Hero Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        {[
          { label: 'Total Papers', value: stats.papers, icon: FileText, color: 'tech-primary' },
          { label: 'Patents Filed', value: stats.patents, icon: Quote, color: 'tech-secondary' },
          { label: 'Active Companies', value: stats.companies, icon: Building, color: 'tech-success' },
          { label: 'Avg TRL Level', value: stats.trl_level, icon: Target, color: 'tech-primary' },
          { label: 'News Articles', value: stats.news, icon: Newspaper, color: 'tech-muted' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="tech-card-hover text-center"
          >
            <div className="flex justify-center mb-2">
              <stat.icon className={`w-6 h-6 text-${stat.color}`} />
            </div>
            <p className="text-2xl font-bold font-jetbrains text-tech-text">
              {stat.value.toLocaleString()}
            </p>
            <p className="text-sm text-tech-muted">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="tech-card"
      >
        <div className="flex items-center mb-4">
          <Zap className="w-5 h-5 text-tech-primary mr-2" />
          <h2 className="text-xl font-orbitron font-semibold text-tech-text">
            AI-Generated Strategic Summary
          </h2>
        </div>
        <div className="prose prose-invert max-w-none">
          <p className="text-tech-muted leading-relaxed">
            {summary}
          </p>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Publication Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="tech-card"
        >
          <h3 className="text-lg font-orbitron font-semibold text-tech-text mb-4">
            Publication Trend Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={publicationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2035" />
              <XAxis 
                dataKey="year" 
                stroke="#4A5568"
                tick={{ fill: '#4A5568' }}
              />
              <YAxis 
                stroke="#4A5568"
                tick={{ fill: '#4A5568' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F1117', 
                  border: '1px solid #1A2035',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="papers" fill="#00D4FF" />
              <Line type="monotone" dataKey="citations" stroke="#FF6B35" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* TRL Gauge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="tech-card"
        >
          <h3 className="text-lg font-orbitron font-semibold text-tech-text mb-4">
            Technology Readiness Level
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={trlData}>
              <RadialBar dataKey="value" cornerRadius={10} fill="#00D4FF" />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-current text-tech-text">
                {stats.trl_level}
              </text>
              <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-current text-tech-muted">
                TRL Level
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-tech-muted text-sm">
              Confidence: {stats.trl_confidence}%
            </p>
          </div>
        </motion.div>
      </div>

      {/* Patent Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <div className="tech-card">
          <h3 className="text-lg font-orbitron font-semibold text-tech-text mb-4">
            Patent Filing Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={patentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2035" />
              <XAxis 
                dataKey="year" 
                stroke="#4A5568"
                tick={{ fill: '#4A5568' }}
              />
              <YAxis 
                stroke="#4A5568"
                tick={{ fill: '#4A5568' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F1117', 
                  border: '1px solid #1A2035',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="patents" stroke="#FF6B35" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="tech-card">
          <h3 className="text-lg font-orbitron font-semibold text-tech-text mb-4">
            Top Patent Assignees
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={assigneeData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2035" />
              <XAxis 
                type="number" 
                stroke="#4A5568"
                tick={{ fill: '#4A5568' }}
              />
              <YAxis 
                type="category" 
                dataKey="assignee" 
                stroke="#4A5568"
                tick={{ fill: '#4A5568' }}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F1117', 
                  border: '1px solid #1A2035',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="patents" fill="#00FF94" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* R&D Investment by Country */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="tech-card"
      >
        <div className="flex items-center mb-4">
          <Globe className="w-5 h-5 text-tech-primary mr-2" />
          <h3 className="text-lg font-orbitron font-semibold text-tech-text">
            R&D Investment by Country (% of GDP)
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={countryData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#1A2035" />
            <XAxis 
              type="number" 
              stroke="#4A5568"
              tick={{ fill: '#4A5568' }}
            />
            <YAxis 
              type="category" 
              dataKey="country" 
              stroke="#4A5568"
              tick={{ fill: '#4A5568' }}
              width={100}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0F1117', 
                border: '1px solid #1A2035',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="investment" fill="#00D4FF" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Word Cloud */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <WordCloud 
          words={wordCloudData} 
          title={`${query} - Technology Keywords & Concepts`}
        />
      </motion.div>

      {/* Latest Papers and News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="tech-card"
        >
          <h3 className="text-lg font-orbitron font-semibold text-tech-text mb-4">
            Latest Research Papers
          </h3>
          <div className="space-y-3">
            {papers?.slice(0, 5).map((paper, index) => (
              <div key={index} className="border-l-2 border-tech-primary pl-4 cursor-pointer hover:bg-tech-primary/5 p-2 rounded transition-colors"
                   onClick={() => setSelectedPaper(paper)}>
                <h4 className="font-medium text-tech-text text-sm mb-1 line-clamp-2 hover:text-tech-primary transition-colors">
                  {paper.title}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-tech-muted">
                  <span>{paper.publication_year}</span>
                  <span>•</span>
                  <span>{paper.cited_by_count || 0} citations</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="tech-card"
        >
          <h3 className="text-lg font-orbitron font-semibold text-tech-text mb-4">
            Latest News & Developments
          </h3>
          <div className="space-y-3">
            {news?.slice(0, 5).map((article, index) => (
              <div key={index} className="border-l-2 border-tech-secondary pl-4">
                <h4 className="font-medium text-tech-text text-sm mb-1 line-clamp-2">
                  {article.title}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-tech-muted">
                  <span>{article.source?.name}</span>
                  <span>•</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Paper Modal */}
      <PaperModal 
        isOpen={!!selectedPaper}
        onClose={() => setSelectedPaper(null)}
        paper={selectedPaper}
      />
    </div>
  )
}

export default TechnologyProfile
