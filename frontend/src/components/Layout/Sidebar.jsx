import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  BarChart3, 
  FileText, 
  Bookmark, 
  User, 
  Settings,
  ChevronDown,
  ChevronRight,
  Home,
  Brain,
  TrendingUp
} from 'lucide-react'
import Logo from './Logo'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Technology Insights', href: '/insights', icon: Brain },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Watchlist', href: '/watchlist', icon: Bookmark },
  { name: 'Profile', href: '/profile', icon: User },
]

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="bg-white/80 backdrop-blur-xl border-r border-white/20 transition-all duration-300 shadow-xl"
    >
      <div className="flex flex-col h-full">
        {/* Logo and toggle */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <Logo showTagline={!isCollapsed} />
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100/50'
                    }`
                  }
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'
                  }`} />
                  {!isCollapsed && (
                    <span className={`font-medium text-sm ${
                      isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {item.name}
                    </span>
                  )}
                </NavLink>
              </motion.div>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-white/20">
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100/50 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-500" />
              {!isCollapsed && (
                <span className="font-medium text-sm text-gray-700">Settings</span>
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-red-500" />
              {!isCollapsed && (
                <span className="font-medium text-sm text-red-600">Upgrade</span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar
