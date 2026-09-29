/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#09180e',
          900: '#0e2617',
          800: '#143823',
          700: '#1c4d30',
          600: '#25633e',
          500: '#327d51',
          100: '#e2ece6',
        },
        assamRed: {
          900: '#751414',
          800: '#941a1a',
          700: '#b31f1f',
          600: '#c52828',
          500: '#dc3535',
          100: '#fbe8e8',
        },
        brass: {
          900: '#6d5312',
          800: '#8c6b16',
          700: '#ad851b',
          600: '#c99b22',
          500: '#e0b034',
          400: '#ecc65c',
          300: '#f3d987',
          100: '#fcf6e5',
        },
        riceCream: {
          50: '#fdfbf7',
          100: '#faf6ee',
          200: '#f4ede0',
          300: '#ece1cb',
          400: '#dfcfb2',
        },
        bamboo: {
          100: '#f3ede2',
          200: '#e5dcce',
          300: '#d5c7b3',
          400: '#bead94',
          700: '#70604b',
        },
        terracotta: {
          500: '#c25337',
          600: '#a84128',
          700: '#8b331d',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Rozha One"', '"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        accent: ['"Rozha One"', 'serif'],
      },
      boxShadow: {
        'brass': '0 8px 30px -4px rgba(201, 155, 34, 0.25)',
        'rich': '0 20px 40px -15px rgba(14, 38, 23, 0.2)',
        'hearth': '0 0 50px rgba(220, 53, 53, 0.35)',
      },
      animation: {
        'flame-flicker': 'flicker 3s ease-in-out infinite alternate',
        'steam-rise': 'steam 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        steam: {
          '0%': { transform: 'translateY(0) scaleX(1)', opacity: '0.3' },
          '50%': { transform: 'translateY(-15px) scaleX(1.1)', opacity: '0.6' },
          '100%': { transform: 'translateY(-30px) scaleX(1.2)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
