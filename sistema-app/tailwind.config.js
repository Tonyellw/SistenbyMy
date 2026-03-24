/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          red: '#ff0040',
          'red-glow': '#ff003366',
          'red-dim': '#cc003399',
          blue: '#00d4ff',
          'blue-glow': '#00d4ff66',
          'blue-dim': '#00a0cc99',
          black: '#050505',
          'black-card': '#0a0a0a',
          'black-elevated': '#111111',
          'black-border': '#1a1a1a',
          'black-hover': '#151515',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-red': '0 0 15px #ff004066, 0 0 45px #ff004022',
        'neon-red-lg': '0 0 25px #ff004088, 0 0 60px #ff004033, 0 0 100px #ff004011',
        'neon-blue': '0 0 15px #00d4ff66, 0 0 45px #00d4ff22',
        'neon-blue-lg': '0 0 25px #00d4ff88, 0 0 60px #00d4ff33, 0 0 100px #00d4ff11',
        'neon-glow': '0 0 20px #ff004044, 0 0 40px #00d4ff22',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 10px #ff004044, 0 0 30px #ff004022' },
          '100%': { boxShadow: '0 0 20px #00d4ff66, 0 0 50px #00d4ff33' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
