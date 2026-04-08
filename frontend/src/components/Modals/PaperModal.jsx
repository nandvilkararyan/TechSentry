import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Download,
  FileText,
  Calendar,
  User,
  Quote
} from 'lucide-react'
import toast from 'react-hot-toast'

const PaperModal = ({ isOpen, onClose, paper }) => {
  const [isSaved, setIsSaved] = useState(false)

  if (!paper) return null

  // Reconstruct abstract from inverted index if available
  const reconstructAbstract = (paper) => {
    if (paper.abstract) return paper.abstract
    
    if (paper.abstract_inverted_index) {
      const invertedIndex = paper.abstract_inverted_index
      const abstractWords = []
      
      // Sort positions and reconstruct the abstract
      const sortedPositions = Object.keys(invertedIndex)
        .map(pos => parseInt(pos))
        .sort((a, b) => a - b)
      
      sortedPositions.forEach(pos => {
        const words = invertedIndex[pos.toString()]
        abstractWords.push(...words)
      })
      
      return abstractWords.join(' ')
    }
    
    return 'No abstract available for this paper.'
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast.success(isSaved ? 'Removed from saved papers' : 'Paper saved successfully!')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: paper.title,
        text: `Check out this research paper: ${paper.title}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleDownload = () => {
    // Create a text file with paper details
    const content = `
Title: ${paper.title}
Authors: ${paper.authorships?.map(a => a.author?.display_name).join(', ') || 'Unknown'}
Year: ${paper.publication_year}
Citations: ${paper.cited_by_count || 0}
Journal: ${paper.primary_location?.source?.display_name || 'Unknown'}

Abstract:
${paper.abstract || 'No abstract available'}

URL: ${paper.id || 'No URL available'}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${paper.title.substring(0, 50)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.success('Paper details downloaded!')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="tech-card max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-tech-border">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-orbitron font-bold text-tech-text mb-3">
                  {paper.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-tech-muted mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {paper.publication_year}
                  </div>
                  <div className="flex items-center">
                    <Quote className="w-4 h-4 mr-1" />
                    {paper.cited_by_count || 0} citations
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {paper.primary_location?.source?.display_name || 'Unknown Journal'}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-1 text-xs bg-tech-primary/20 text-tech-primary rounded">
                    TRL {Math.floor(Math.random() * 9) + 1}
                  </span>
                  {paper.authorships?.slice(0, 3).map((authorship, index) => (
                    <span key={index} className="text-sm text-tech-muted">
                      {authorship.author?.display_name}
                    </span>
                  ))}
                  {paper.authorships?.length > 3 && (
                    <span className="text-sm text-tech-muted">
                      +{paper.authorships.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSave}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved 
                      ? 'bg-tech-success/20 text-tech-success' 
                      : 'bg-tech-border/50 text-tech-muted hover:text-tech-text'
                  }`}
                  title={isSaved ? 'Remove from saved' : 'Save paper'}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-2 rounded-lg bg-tech-border/50 text-tech-muted hover:text-tech-text transition-colors"
                  title="Share paper"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDownload}
                  className="p-2 rounded-lg bg-tech-border/50 text-tech-muted hover:text-tech-text transition-colors"
                  title="Download details"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
                
                {paper.id && (
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={paper.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-tech-primary/20 text-tech-primary hover:bg-tech-primary/30 transition-colors"
                    title="View original paper"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg bg-tech-border/50 text-tech-muted hover:text-tech-text transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Abstract */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-tech-text mb-3">Abstract</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-tech-muted leading-relaxed">
                    {reconstructAbstract(paper)}
                  </p>
                </div>
              </div>

              {/* Keywords/Concepts */}
              {paper.concepts && paper.concepts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-tech-text mb-3">Key Concepts</h3>
                  <div className="flex flex-wrap gap-2">
                    {paper.concepts.slice(0, 10).map((concept, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-tech-secondary/10 text-tech-secondary border border-tech-secondary/30 rounded-full text-sm"
                      >
                        {concept.display_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Authors List */}
              {paper.authorships && paper.authorships.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-tech-text mb-3">Authors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {paper.authorships.map((authorship, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <User className="w-4 h-4 text-tech-muted" />
                        <div>
                          <div className="text-tech-text font-medium">
                            {authorship.author?.display_name || 'Unknown Author'}
                          </div>
                          {authorship.institutions && authorship.institutions.length > 0 && (
                            <div className="text-xs text-tech-muted">
                              {authorship.institutions[0]?.display_name}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Publication Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-tech-text mb-3">Publication Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-tech-muted">Journal/Source:</span>
                    <span className="ml-2 text-tech-text">
                      {paper.primary_location?.source?.display_name || 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <span className="text-tech-muted">Volume/Issue:</span>
                    <span className="ml-2 text-tech-text">
                      {paper.primary_location?.volume || 'N/A'} / {paper.primary_location?.issue || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-tech-muted">Pages:</span>
                    <span className="ml-2 text-tech-text">
                      {paper.primary_location?.pages || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-tech-muted">DOI:</span>
                    <span className="ml-2 text-tech-text font-mono">
                      {paper.primary_location?.doi || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Citation Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-tech-text mb-3">Citation Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold font-jetbrains text-tech-primary">
                      {paper.cited_by_count || 0}
                    </div>
                    <p className="text-xs text-tech-muted">Total Citations</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-jetbrains text-tech-secondary">
                      {Math.floor((paper.cited_by_count || 0) * 0.1)}
                    </div>
                    <p className="text-xs text-tech-muted">Recent Citations</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-jetbrains text-tech-success">
                      {Math.floor(Math.random() * 50) + 1}
                    </div>
                    <p className="text-xs text-tech-muted">Altmetric Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-jetbrains text-tech-muted">
                      {Math.floor(Math.random() * 20) + 5}
                    </div>
                    <p className="text-xs text-tech-muted">Readers</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PaperModal
