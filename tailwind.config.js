/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#020105',
          900: '#05070c',
          800: '#0a0d14',
          700: '#0f121a',
          600: '#141820',
          500: '#1a1e28',
        },
        cyber: {
          dark: '#05070c',
          deeper: '#020203',
          surface: '#0a0d14',
          border: '#1a1e28',
        }
      },
    },
  },
  plugins: [],
}
