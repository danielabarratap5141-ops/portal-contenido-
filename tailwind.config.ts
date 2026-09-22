import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b0d12",
          900: "#12151c",
          800: "#1a1e28",
          700: "#242936",
          600: "#333a4a",
          500: "#4a5268",
          400: "#6b7386",
          300: "#9aa1b2",
          200: "#c4c9d4",
          100: "#e4e7ed",
          50: "#f5f6f8",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 18, 25, 0.06), 0 1px 1px rgba(15, 18, 25, 0.04)",
        card: "0 1px 3px rgba(15, 18, 25, 0.08), 0 4px 12px rgba(15, 18, 25, 0.04)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
