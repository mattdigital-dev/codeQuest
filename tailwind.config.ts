import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#f6e7c1",
        coral: "#f08a8d",
        lilac: "#c0a3e5",
        lagoon: "#8ed1c2",
        sky: "#7fb2ff",
        dusk: "#4f4b57",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 20px 60px rgba(255, 255, 255, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
