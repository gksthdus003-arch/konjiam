import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16211f",
        field: "#f4f8f3",
        pine: "#0f766e",
        coral: "#e85d4f",
        ambered: "#f59e0b",
        line: "#d8e6df"
      },
      boxShadow: {
        soft: "0 12px 32px rgba(22, 33, 31, 0.10)"
      }
    }
  },
  plugins: []
} satisfies Config;
