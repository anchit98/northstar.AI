import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-default": "#0B0F14",
        "surface-raised": "#141A22",
        "surface-overlay": "#1C2430",
        "surface-container": "#1c2025",
        "surface-container-high": "#262a30",
        "surface-variant": "#31353b",
        "on-surface": "#e0e2ea",
        "on-surface-variant": "#c1c7d3",
        "outline-variant": "#414751",
        "border-subtle": "rgba(51, 65, 85, 0.12)",
        primary: "#a2c9ff",
        "primary-container": "#5b9fed",
        "on-primary-container": "#003560",
        "private-workbench": "#907CFF",
        "metrics-gold": "#FFBF00",
        "success-green": "#10B981",
        secondary: "#c9bfff",
        "secondary-container": "#462cb1",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        base: "8px",
        "margin-mobile": "16px",
        "margin-desktop": "32px",
        gutter: "24px",
        "rail-width": "72px",
      },
      fontFamily: {
        sans: ["var(--font-hanken)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "500" }],
        "metric-display": ["48px", { lineHeight: "56px", letterSpacing: "-0.03em", fontWeight: "800" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};

export default config;
