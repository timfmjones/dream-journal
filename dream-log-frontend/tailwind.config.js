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
        },
        // Complementary colors
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
        },
        gray: {
          50: '#fafbfc',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'sm': '0.5rem',
        'DEFAULT': '0.75rem',
        'md': '1rem',
        'lg': '1.25rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'purple': '0 4px 14px rgba(102, 51, 238, 0.25)',
        'purple-lg': '0 10px 25px rgba(102, 51, 238, 0.3)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-purple': 'linear-gradient(135deg, #6633ee 0%, #5521d9 100%)',
        'gradient-purple-light': 'linear-gradient(135deg, rgba(102, 51, 238, 0.1) 0%, rgba(85, 33, 217, 0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      maxWidth: {
        'narrow': '48rem',
        'wide': '72rem',
        'wider': '80rem',
      },
    },
  },
  plugins: [
    // Custom plugin for modern utilities
    function({ addUtilities }) {
      addUtilities({
        '.text-gradient': {
          'background-image': 'linear-gradient(135deg, #6633ee 0%, #5521d9 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.border-gradient': {
          'border': '2px solid transparent',
          'background-image': 'linear-gradient(white, white), linear-gradient(135deg, #6633ee 0%, #5521d9 100%)',
          'background-origin': 'border-box',
          'background-clip': 'content-box, border-box',
        },
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.9)',
          'backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-purple': {
          'background': 'rgba(102, 51, 238, 0.1)',
          'backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(102, 51, 238, 0.2)',
        },
      })
    }
  ],
  safelist: [
    // Gradient backgrounds
    'bg-gradient-to-br',
    'bg-gradient-purple',
    'bg-gradient-purple-light',
    'from-purple-50',
    'from-purple-100',
    'from-purple-600',
    'to-purple-700',
    'to-purple-800',
    'via-purple-50',
    'via-purple-100',
    
    // Royal purple colors
    'bg-purple-50',
    'bg-purple-100',
    'bg-purple-600',
    'bg-purple-700',
    'text-purple-600',
    'text-purple-700',
    'text-purple-800',
    'border-purple-100',
    'border-purple-200',
    'border-purple-500',
    'border-purple-600',
    
    // Hover states
    'hover:bg-purple-50',
    'hover:bg-purple-700',
    'hover:bg-white',
    'hover:text-purple-600',
    'hover:text-white',
    'hover:border-purple-600',
    'hover:shadow-purple',
    'hover:shadow-purple-lg',
    
    // Focus states
    'focus:ring-purple-500',
    'focus:ring-purple-600',
    'focus:border-purple-600',
    'focus:shadow-purple',
    
    // Animation classes
    'animate-fade-in',
    'animate-slide-up',
    'animate-slide-in',
    'animate-scale-in',
    'animate-pulse-slow',
    
    // Modern utilities
    'text-gradient',
    'border-gradient',
    'glass',
    'glass-purple',
    
    // Rounded corners
    'rounded-sm',
    'rounded-md',
    'rounded-lg',
    'rounded-xl',
    'rounded-2xl',
    'rounded-3xl',
    'rounded-full',
    
    // Shadows
    'shadow-sm',
    'shadow-md',
    'shadow-lg',
    'shadow-xl',
    'shadow-2xl',
    'shadow-purple',
    'shadow-purple-lg',
    
    // Backdrop blur
    'backdrop-blur-sm',
    'backdrop-blur',
    'backdrop-blur-md',
    'backdrop-blur-lg',
    'backdrop-blur-xl',
  ]
}