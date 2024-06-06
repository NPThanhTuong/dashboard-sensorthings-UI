/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "headline": "#0d0d0d",
        "sub-headline": "#2a2a2a",
        "card-background": "#eff0f3",
        "highlight": "#ff8e3c",
        "primary": "#eff0f3",
        "secondary": "#fffffe",
        "tertiary": "#d9376e",
      }
    },
  },
  plugins: [],
}