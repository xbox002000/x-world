import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#07080c",
        ink: "#0c0e14",
        mist: "#8b93a7",
        frost: "#e8ecf4",
        accent: "#7eb8ff",
        glow: "#a78bfa",
        success: "#6ee7b7",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 0 40px rgba(126, 184, 255, 0.08)",
        panel: "0 24px 80px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
