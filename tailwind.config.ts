import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { cream: "#F7F4EC", ink: "#201B18", espresso: "#342219", lime: "#C7F36B", amber: "#E8903D", muted: "#746E68" },
    fontFamily: { sans: ["var(--font-body)"], display: ["var(--font-display)"] },
    boxShadow: { soft: "0 18px 60px rgba(52,34,25,.10)" },
    borderRadius: { "4xl": "2rem" }
  }}, plugins: []
} satisfies Config;
