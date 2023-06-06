import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      desktop: "1200px",
      laptop: "992px",
      tablet: "768px",
    },
    extend: {
      colors: {
        fiesta: {
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          900: "#701a75",
        },
      },
      fontFamily: {
        basic: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
