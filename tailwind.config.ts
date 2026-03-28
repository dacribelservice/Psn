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
        "primary-fixed-dim": "#f7be34",
        "on-primary-fixed-variant": "#5c4300",
        "surface-variant": "#33343d",
        "tertiary-fixed-dim": "#c6c6c6",
        "on-primary-container": "#674b00",
        "secondary-fixed": "#dfe0fe",
        "secondary": "#c3c4e2",
        "surface": "#11131b",
        "primary-container": "#f2b92f",
        "error": "#ffb4ab",
        "surface-bright": "#373942",
        "on-background": "#e1e1ed",
        "secondary-container": "#42455d",
        "surface-container-highest": "#33343d",
        "primary": "#f7be34",
        "inverse-surface": "#e1e1ed",
        "surface-dim": "#11131b",
        "on-secondary-fixed-variant": "#42455d",
        "on-surface-variant": "#d3c5ad",
        "surface-container-high": "#282a32",
        "on-error-container": "#ffdad6",
        "surface-container-lowest": "#0c0e15",
        "primary-fixed": "#ffdea0",
        "on-primary-fixed": "#261900",
        "tertiary": "#dedede",
        "on-tertiary-container": "#4e5050",
        "background": "#11131b",
        "inverse-primary": "#795900",
        "surface-tint": "#f7be34",
        "secondary-fixed-dim": "#c3c4e2",
        "surface-container-low": "#191b23",
        "on-surface": "#e1e1ed",
        "on-tertiary-fixed-variant": "#454747",
        "outline": "#9c8f7a",
        "on-tertiary-fixed": "#1a1c1c",
        "on-secondary-container": "#b1b3d0",
        "surface-container": "#1d1f27",
        "tertiary-container": "#c1c2c2",
        "inverse-on-surface": "#2e3039",
        "on-secondary": "#2c2f46",
        "on-error": "#690005",
        "error-container": "#93000a",
        "outline-variant": "#4f4634",
        "on-secondary-fixed": "#171a30",
        "tertiary-fixed": "#e2e2e2",
        "on-primary": "#402d00",
        "on-tertiary": "#2f3131"
      },
      fontFamily: {
        "display": ["var(--font-inter)", "sans-serif"],
        "headline": ["var(--font-inter)", "sans-serif"],
        "body": ["var(--font-inter)", "sans-serif"],
        "label": ["var(--font-inter)", "sans-serif"],
        "sans": ["var(--font-inter)", "sans-serif"]
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "900" }],
        "headline-sm": ["1.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        "label-sm": ["0.6875rem", { lineHeight: "1.5", letterSpacing: "0.2em", fontWeight: "900" }],
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
};

export default config;
