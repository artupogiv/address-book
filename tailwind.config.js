/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html',
    './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        reddit: ['Reddit Sans', 'sans-serif']
      }
    },
  },
  plugins: [],
}

