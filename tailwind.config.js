/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: "rgba(255, 255, 255, 0.1)",
        glassBorder: "rgba(255, 255, 255, 0.2)",
        neoBlack: "#1a1a1a",
        neoWhite: "#f5f5f5",
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
