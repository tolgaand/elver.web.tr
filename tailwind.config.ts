import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Renk tanımları globals.css içindeki @theme bloğuna taşındı
    },
  },
  plugins: [],
} satisfies Config;
