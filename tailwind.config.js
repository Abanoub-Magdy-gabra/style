/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50: '#f2f7f4',
          100: '#dfeae2',
          200: '#c2d5c8',
          300: '#a0b8a9',
          400: '#7c9a86',
          500: '#5e806a',
          600: '#4A6741', // Main primary
          700: '#3d5236',
          800: '#34432f',
          900: '#2e3a2a',
          950: '#171e16',
        },
        secondary: {
          50: '#fcf5f2',
          100: '#f9e9e3',
          200: '#f4d5c9',
          300: '#ecb9a4',
          400: '#e29575',
          500: '#C35A38', // Main secondary (terracotta)
          600: '#bc4f2d',
          700: '#9d3b21',
          800: '#81331f',
          900: '#6c2e1d',
          950: '#3a150e',
        },
        accent: {
          50: '#f7f3ed',
          100: '#E8DCCA', // Main accent (warm beige)
          200: '#e0ceb2',
          300: '#d3b990',
          400: '#c6a372',
          500: '#bb915a',
          600: '#a77c4d',
          700: '#8a6141',
          800: '#734f3a',
          900: '#614234',
          950: '#352219',
        },
        neutral: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#9a9a9a',
          600: '#818181',
          700: '#6a6a6a',
          800: '#5a5a5a',
          900: '#4e4e4e',
          950: '#282828',
        },
      },
      animation: {
        'ping': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        ping: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '75%, 100%': { transform: 'scale(2.5)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};