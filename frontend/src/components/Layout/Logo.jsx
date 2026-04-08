import React from "react";
import { motion } from "framer-motion";

const Logo = ({ size = "medium", showTagline = false }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  const textSizes = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl",
  };

  const shieldSizes = {
    small: 16,
    medium: 20,
    large: 24,
  };

  return (
    <div className="flex items-center space-x-3">
      <div
        className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden shadow-sm`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600" />
        <div className="absolute inset-[2px] rounded-[10px] bg-white/90" />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="text-sky-700"
            width={shieldSizes[size]}
            height={shieldSizes[size]}
          >
            <path
              d="M12 2.75L5.25 6.5v5.25c0 4.67 3.05 8.94 6.75 10.04 3.7-1.1 6.75-5.37 6.75-10.04V6.5L12 2.75z"
              fill="currentColor"
              fillOpacity="0.12"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="M9.2 11.9l2 1.95 3.8-3.8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <motion.div
          className="absolute -inset-1 rounded-xl border border-cyan-400/50"
          animate={{ opacity: [0.25, 0.7, 0.25] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="flex flex-col">
        <div
          className={`font-orbitron font-bold leading-tight ${textSizes[size]}`}
        >
          <span className="text-sky-600">Tech</span>
          <span className="text-slate-900">Sentry</span>
        </div>
        {showTagline && (
          <div className="text-xs text-slate-500 font-medium tracking-wide">
            Intelligence. Foresight.
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
