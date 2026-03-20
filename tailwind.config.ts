import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["'Courier New'", "'Lucida Console'", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "retro-green": "#00ff41",
        "retro-amber": "#ffb000",
        "retro-black": "#0d0d0d",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
export default config;
