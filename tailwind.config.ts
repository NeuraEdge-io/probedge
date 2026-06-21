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
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E8C84A",
          muted: "#8B7536",
          dark: "#5C4D1E",
        },
        obsidian: {
          DEFAULT: "#0F0F08",
          card: "#1A1A0E",
          hover: "#222215",
          border: "#2C2C1A",
        },
        cream: {
          DEFAULT: "#F5F0E8",
          muted: "#C8BFA8",
          dim: "#9A8F78",
        },
        edge: {
          green: "#22C55E",
          red: "#EF4444",
          amber: "#F59E0B",
        }
      },
      fontFamily: {
        display: ["'Oswald'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #8B7536 100%)",
        "dark-gradient": "linear-gradient(180deg, #1A1A0E 0%, #0F0F08 100%)",
      },
      animation: {
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        pulseGold: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 8px rgba(212,175,55,0.4)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 20px rgba(212,175,55,0.8)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
