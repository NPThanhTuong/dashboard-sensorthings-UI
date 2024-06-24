/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Sử dụng class để kích hoạt dark mode
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        headline: "#0d0d0d",
        "sub-headline": "#2a2a2a",
        "card-background": "#eff0f3",
        highlight: "#00BB00",
        primary: "#00BB00",
        secondary: "#fffffe",
        tertiary: "#36DA6D",
        darkPrimary: "#001529", // màu xanh đậm
        darkSecondary: "#081A2E", // màu xanh đậm
        textDark: "#F7F9FC", // màu đen
        darkHeadline: "#e5e5e5", // màu xám
        darkInput: "#020e1a",
        darkButton: "#0A84FF",
      },
    },
  },
  plugins: [],
};
