import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Bookmark, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Activity,
  TrendingUp,
  FileText,
  RefreshCw,
  Bell
} from 'lucide-react'
import toast from 'react-hot-toast'

const Watchlist = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newItem, setNewItem] = useState({
    technology: '',
    query: ''
  })

  const queryClient = useQueryClient()

  const { data: watchlist, isLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      const response = await fetch('/api/watchlist/')
      if (!response.ok) throw new Error('Failed to fetch watchlist')
      return response.json()
    }
  })

  const addToWatchlistMutation = useMutation({
    mutationFn: async (item) => {
      const response = await fetch('/api/watchlist/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item)
      })
      if (!response.ok) throw new Error('Failed to add to watchlist')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlist'])
      setShowAddModal(false)
      setNewItem({ technology: '', query: '' })
      toast.success('Added to watchlist!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add to watchlist')
    }
  })

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (itemId) => {
      const response = await fetch(`/api/watchlist/${itemId}/`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to remove from watchlist')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlist'])
      toast.success('Removed from watchlist')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to remove from watchlist')
    }
  })

  const handleAddToWatchlist = () => {
    if (!newItem.technology.trim()) {
      toast.error('Please enter a technology name')
      return
    }

    addToWatchlistMutation.mutate({
      technology: newItem.technology,
      query: newItem.query || newItem.technology
    })
  }

  const handleRemoveFromWatchlist = (itemId) => {
    if (window.confirm('Are you sure you want to remove this from your watchlist?')) {
      removeFromWatchlistMutation.mutate(itemId)
    }
  }

  const WatchlistCard = ({ item }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="tech-card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="relative">
              <Bookmark className="w-5 h-5 text-tech-primary" />
              {(item.new_papers_count > 0 || item.new_patents_count > 0) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-tech-secondary rounded-full animate-pulse"></div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-tech-text">
              {item.technology}
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-tech-primary">
                <FileText className="w-4 h-4" />
                <span className="font-mono font-bold">{item.new_papers_count}</span>
              </div>
              <p className="text-xs text-tech-muted">New Papers</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-tech-secondary">
                <TrendingUp className="w-4 h-4" />
                <span className="font-mono font-bold">{item.new_patents_count}</span>
              </div>
              <p className="text-xs text-tech-muted">New Patents</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-tech-muted">
                <Activity className="w-4 h-4" />
                <span className="font-mono font-bold text-sm">
                  {new Date(item.last_updated).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-tech-muted">Last Updated</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Bell className="w-4 h-4 text-tech-muted" />
                <span className={`font-mono font-bold text-sm ${
                  (item.new_papers_count > 0 || item.new_patents_count > 0) 
                    ? 'text-tech-secondary' 
                    : 'text-tech-muted'
                }`}>
                  {(item.new_papers_count > 0 || item.new_patents_count > 0) ? 'Active' : 'Quiet'}
                </span>
              </div>
              <p className="text-xs text-tech-muted">Status</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = `/technology?q=${encodeURIComponent(item.query)}`}
              className="tech-button-secondary text-sm flex items-center space-x-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>View Analysis</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.info('Refresh coming soon!')}
              className="tech-button-secondary text-sm flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleRemoveFromWatchlist(item.id)}
          className="ml-4 p-2 text-tech-muted hover:text-tech-secondary transition-colors"
          title="Remove from watchlist"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-tech-text mb-2">
            Technology Watchlist
          </h1>
          <p className="text-tech-muted">
            Monitor emerging technologies and get alerts on new developments
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="tech-button-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Technology</span>
        </motion.button>
      </div>

      {/* Watchlist Stats */}
      {watchlist && watchlist.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="tech-card text-center">
            <div className="text-2xl font-bold font-jetbrains text-tech-primary">
              {watchlist.length}
            </div>
            <p className="text-sm text-tech-muted">Technologies Tracked</p>
          </div>
          
          <div className="tech-card text-center">
            <div className="text-2xl font-bold font-jetbrains text-tech-secondary">
              {watchlist.reduce((sum, item) => sum + item.new_papers_count, 0)}
            </div>
            <p className="text-sm text-tech-muted">New Research Papers</p>
          </div>
          
          <div className="tech-card text-center">
            <div className="text-2xl font-bold font-jetbrains text-tech-success">
              {watchlist.reduce((sum, item) => sum + item.new_patents_count, 0)}
            </div>
            <p className="text-sm text-tech-muted">New Patents Filed</p>
          </div>
        </motion.div>
      )}

      {/* Watchlist Items */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tech-primary mx-auto"></div>
          <p className="text-tech-muted mt-4">Loading watchlist...</p>
        </div>
      ) : watchlist && watchlist.length > 0 ? (
        <div className="space-y-4">
          {watchlist.map((item) => (
            <WatchlistCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 text-tech-muted mx-auto mb-4" />
          <h3 className="text-xl font-orbitron font-semibold text-tech-text mb-2">
            No Technologies in Watchlist
          </h3>
          <p className="text-tech-muted mb-6">
            Add technologies to your watchlist to monitor their development and get alerts on new research
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="tech-button-primary"
          >
            Add First Technology
          </motion.button>
        </div>
      )}

      {/* Add to Watchlist Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="tech-card max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-orbitron font-bold text-tech-text mb-6">
              Add Technology to Watchlist
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-tech-text mb-2">
                  Technology Name
                </label>
                <input
                  type="text"
                  value={newItem.technology}
                  onChange={(e) => setNewItem(prev => ({ ...prev, technology: e.target.value }))}
                  className="tech-input"
                  placeholder="e.g., Quantum Computing, Hypersonic Systems"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tech-text mb-2">
                  Search Query (Optional)
                </label>
                <input
                  type="text"
                  value={newItem.query}
                  onChange={(e) => setNewItem(prev => ({ ...prev, query: e.target.value }))}
                  className="tech-input"
                  placeholder="Custom search terms for this technology"
                />
                <p className="text-xs text-tech-muted mt-1">
                  If not provided, the technology name will be used as the search query
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddModal(false)}
                  className="tech-button-secondary"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToWatchlist}
                  disabled={addToWatchlistMutation.isLoading}
                  className="tech-button-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  {addToWatchlistMutation.isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Add to Watchlist</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Watchlist
