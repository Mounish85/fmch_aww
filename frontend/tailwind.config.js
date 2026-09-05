/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a2e",
        surface: "#fafaf5",
        accent: {
          red: "#e63946",
          blue: "#4ea8de",
          green: "#2ecc71",
          yellow: "#f1c40f",
        },
      },
      boxShadow: {
        'cel-sm': '2px 2px 0 #1a1a2e',
        'cel': '3px 3px 0 #1a1a2e',
        'cel-lg': '4px 4px 0 #1a1a2e',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

