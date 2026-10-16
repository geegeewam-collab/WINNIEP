import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        winniep: {
          ivory: "#F7F3EB",
          copper: "#B87343",
          espresso: "#2D241F",
          sand: "#DFCFBA",
          white: "#FFFFFF",
          textSecondary: "#6F655D",
          border: "#E8E0D6",
          muted: "#F0E9DF",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
