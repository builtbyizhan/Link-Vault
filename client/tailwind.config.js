/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#090a0f",
          900: "#0f1117",
          800: "#161820",
          700: "#1e2130",
        },
        accent: {
          DEFAULT: "#e8ff47",
          dim: "#c8dc2a",
        },
        muted: "#4a5068",
        border: "#1e2130",
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease forwards",
        "scale-in": "scaleIn 0.2s ease forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: 0, transform: "scale(0.95)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};