/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: {
          50: "#ecfeff",
          100: "#cffafe",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
        },
        holo: {
          bg: "#020617",
          surface: "#020617",
          panel: "#020617",
          card: "#020617",
          border: "#1e293b",
          "border-soft": "#0f172a",
          "text-primary": "#e5f2ff",
          "text-secondary": "#93a3c0",
          cyan: "#22d3ee",
          "cyan-soft": "rgba(34,211,238,0.15)",
          "cyan-hover": "#38e0ff",
          indigo: "#4f46e5",
          "accent": "#22d3ee",
        },
      },
      boxShadow: {
        "holo-soft": "0 18px 65px rgba(15,23,42,0.95)",
        "holo-glow": "0 0 35px rgba(56,189,248,0.45)",
        "holo-card": "0 30px 90px rgba(15,23,42,0.9)",
      },
      borderRadius: {
        "3xl": "1.75rem",
      },
      backgroundImage: {
        "holo-radial":
          "radial-gradient(120% 120% at 15% 20%, rgba(56,189,248,0.25), transparent 55%), radial-gradient(120% 120% at 85% 0%, rgba(79,70,229,0.35), transparent 55%), radial-gradient(160% 160% at 50% 120%, rgba(0,0,0,0.95), #020617)",
      },
    },
  },
  plugins: [],
}
