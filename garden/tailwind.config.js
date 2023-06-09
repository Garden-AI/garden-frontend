/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      display: ["Work Sans", "sans-serif"]
    },
    colors:{
      'green': '#53A86C',
      'white': '#ffffff',
      'transparent': 'transparent',
      'black': 'black',
      'gray': {
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#64748b',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937'
      },
    },
  },
  plugins: [],
}

