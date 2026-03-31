/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'executive-dark': '#121212',
        'executive-panel': '#1E1E1E',
        'danger-red': '#D32F2F',
        'warning-orange': '#F57C00',
        'secure-green': '#388E3C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};