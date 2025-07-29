/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Royal purple color palette
        purple: {
          50: '#f3f1ff',
          100: '#e9e5ff',
          200: '#d5ccff',
          300: '#b8a3ff',
          400: '#9670ff',
          500: '#7c3aed',
          600: '#6633ee', // Main royal purple
          700: '#5521d9',
          800: '#4818b5',
          900: '#3c1494',
          950: '#250863',
        }
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}