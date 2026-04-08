import React from "react";
import { motion } from "framer-motion";
import { Bell, Search, LogOut, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-tech-surface border-b border-tech-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-tech-border transition-colors"
        >
          <Menu className="w-5 h-5 text-tech-text" />
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-tech-muted" />
            <input
              type="text"
              placeholder="Search technologies, papers, patents..."
              className="w-full pl-10 pr-4 py-2 bg-tech-bg border border-tech-border rounded-lg text-tech-text placeholder-tech-muted focus:outline-none focus:border-tech-primary focus:ring-1 focus:ring-tech-primary"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg hover:bg-tech-border transition-colors"
          >
            <Bell className="w-5 h-5 text-tech-text" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-tech-secondary rounded-full animate-pulse"></span>
          </motion.button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-tech-text">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="text-xs text-tech-muted">
                {user?.organization || "Defence Research"}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="p-2 rounded-lg hover:bg-tech-border transition-colors text-tech-muted hover:text-tech-text"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
