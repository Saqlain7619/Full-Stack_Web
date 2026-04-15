/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f1',
          100: '#ffdfdf',
          200: '#ffc5c5',
          300: '#ff9d9d',
          400: '#ff6464',
          500: '#d91a1a', 
          600: '#8b0000', // Deep Red (Brand Primary)
          700: '#770000',
          800: '#5e0000',
          900: '#4a0000',
        },
        dark: '#000000',
        luxury: {
          white: '#FFFFFF',
          gray: '#F5F5F5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        luxury: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
        'premium-hover': '0 20px 50px -12px rgba(139, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
