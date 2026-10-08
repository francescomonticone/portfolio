import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#0a0a0f",
        card: "#161616",
        carddeep: "#18181b",
        ink: "#e4e4e7",
        muted: "#a1a1aa",
        faint: "#71717a",
        line: "#27272a",
        primary: "#00a3ff",
        pcyan: "#22d3ee",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        bento: "16px",
        frost: "24px",
        shell: "32px",
      },
    },
  },
  plugins: [],
};
export default config;
