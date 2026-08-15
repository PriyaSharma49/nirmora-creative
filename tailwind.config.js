/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // "The Current" — dark cinematic anchors and warm cream/stone
        // editorial sections carrying one bright yellow signal. See
        // src/theme.js for the canonical hex reference.
        cream: {
          DEFAULT: "#FBF7EF",
          card: "#FAF9F5",
        },
        stone: {
          DEFAULT: "#DCD8CE",
          card: "#F4F0E7",
        },
        charcoal: {
          DEFAULT: "#20221F",
          soft: "rgba(32,34,31,0.62)",
          dim: "rgba(32,34,31,0.40)",
        },
        dark: {
          DEFAULT: "#101210",
          secondary: "#171916",
          deepest: "#0D0F0D",
        },
        yellow: {
          light: "#FFD34D",
          DEFAULT: "#F5C400",
          text: "#171717",
        },
        surface: {
          DEFAULT: "#FBF7EF",
          raised: "#FAF9F5",
        },
      },
      fontFamily: {
        display: ["'Instrument Serif'", "serif"],
        body: ["'Manrope'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(17,17,17,0.12)",
        yellow: "0 12px 30px -10px rgba(245,196,0,0.4)",
      },
      borderRadius: {
        xl2: "32px",
        xl3: "36px",
      },
    },
  },
  plugins: [],
}
