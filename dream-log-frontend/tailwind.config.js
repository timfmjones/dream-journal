/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#6b46c1', // Updated to match logo
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      maxWidth: {
        'narrow': '48rem',
        'wide': '72rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    // Gradient backgrounds
    'bg-gradient-to-br',
    'from-purple-50',
    'via-pink-50',
    'to-indigo-50',
    'from-purple-100',
    'via-pink-100',
    'to-indigo-100',
    'from-purple-500',
    'to-purple-600',
    'from-purple-600',
    'to-purple-700',
    'from-indigo-50',
    'via-purple-50',
    'to-pink-50',
    
    // Border colors
    'border-purple-100',
    'border-purple-200',
    'border-purple-300',
    'border-purple-500',
    'border-indigo-100',
    
    // Text colors
    'text-purple-600',
    'text-purple-700',
    'text-purple-800',
    'text-indigo-600',
    'text-indigo-700',
    
    // Background colors
    'bg-purple-50',
    'bg-purple-100',
    'bg-indigo-50',
    'bg-indigo-100',
    
    // Hover states
    'hover:bg-purple-50',
    'hover:bg-purple-700',
    'hover:bg-purple-800',
    'hover:border-purple-300',
    'hover:text-purple-600',
    'hover:text-purple-800',
    
    // Focus states
    'focus:ring-purple-500',
    'focus:border-purple-500',
    
    // Animation classes
    'fade-in',
    'animate-fade-in',
    'animate-slide-up',
    
    // Container classes
    'container-narrow',
    'container-wide',
    'content-container',
    
    // Button and form classes
    'button-group',
    'form-section',
    'generation-mode-grid',
    
    // Logo and custom classes
    'logo-container',
    'logo-icon',
    'large',
    'dream-card',
    'fairy-tale-content',
    'modal-backdrop',
    'focus-ring',
  ]
}