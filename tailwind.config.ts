import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: colors.zinc,
        paper: colors.stone,
        charcoal: colors.neutral,
      },
    },
  },
  plugins: [],
}
export default config
