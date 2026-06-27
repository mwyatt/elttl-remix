import {colors} from "~/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
  "./app/**/*.{js,jsx,ts,tsx}",
  "./workers/**/*.{js,ts}",
  "./index.html"
],
  theme: {
    extend: {
      colors: colors
    }
  },
  plugins: []
}

export default config
