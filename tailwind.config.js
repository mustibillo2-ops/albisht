/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          brown: "#2b1b12",
          black: "#000000",
          white: "#ffffff",
          gold: "#d4af37",
          soft: "#f8f5f0",
        },
      },
      boxShadow: {
        card: "0 18px 40px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      fontFamily: {
        arabic: ["var(--font-tajawal)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

