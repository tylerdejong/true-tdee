import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17201d",
        moss: "#2f6f5e",
        mint: "#dff4ec",
        skyglass: "#e6f1f5",
        amberline: "#e5a33a",
        coral: "#da6b57"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 32, 29, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
