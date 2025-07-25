/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#e6f1ff',
          100: '#b3d7ff',
          200: '#80bdff',
          300: '#4da3ff',
          400: '#1a89ff',
          500: '#0070f3',
          600: '#0064db',
          700: '#0050bf',
          800: '#003ca6',
          900: '#002885'
        }
      },
      boxShadow: {
        'float-button': '0 4px 15px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'float-menu': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}