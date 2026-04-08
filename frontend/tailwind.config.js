/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tech-primary': '#00D4FF',
        'tech-secondary': '#FF6B35',
        'tech-success': '#00FF94',
        'tech-bg': '#0A0C10',
        'tech-surface': '#0F1117',
        'tech-border': '#1A2035',
        'tech-text': '#E8EDF2',
        'tech-muted': '#4A5568',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'tech-gradient': 'linear-gradient(135deg, #00D4FF 0%, #0066FF 100%)',
        'grid-pattern': `radial-gradient(circle at 1px 1px, rgba(0, 212, 255, 0.15) 1px, transparent 1px)`,
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar-sweep 4s linear infinite',
      },
      keyframes: {
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
