import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // The Tibetan font only covers Tibetan code points, so putting it
        // first lets Tibetan text anywhere use it while Latin falls through.
        sans: ["var(--font-tibetan)", ...defaultTheme.fontFamily.sans],
        tibetan: ["var(--font-tibetan)", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
