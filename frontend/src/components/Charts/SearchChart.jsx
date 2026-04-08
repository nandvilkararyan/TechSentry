import React from 'react'
import { motion } from 'framer-motion'

const SearchChart = ({ searchResults }) => {
  if (!searchResults) return null

  const data = [
    { label: 'Papers', value: searchResults.papers?.length || 0, color: 'text-tech-primary' },
    { label: 'Patents', value: searchResults.patents?.length || 0, color: 'text-accent-gold' },
    { label: 'News', value: searchResults.news?.length || 0, color: 'text-accent-secondary' },
    { label: 'Companies', value: searchResults.companies?.length || 0, color: 'text-tech-primary/80' }
  ]

  const maxValue = Math.max(...data.map(d => d.value), 1)

  return (
    <div className="tech-card p-6">
      <h3 className="text-lg font-orbitron font-semibold text-tech-text mb-4">
        Results Distribution
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3"
          >
            <div className="w-20 text-sm text-tech-muted font-medium">
              {item.label}
            </div>
            <div className="flex-1 bg-tech-secondary rounded-full h-6 relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`h-full ${item.color} bg-gradient-to-r from-tech-primary/20 to-tech-primary`}
              />
            </div>
            <div className="w-12 text-sm font-bold text-tech-text text-right">
              {item.value}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SearchChart
