/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        headline: "#0d0d0d", // màu đen
        "sub-headline": "#2a2a2a", // đen mờ
        "card-background": "#eff0f3", // màu xám
        highlight: "#00BB00", // màu xanh lá chính
        primary: "#00BB00",
        secondary: "#fffffe", // màu trắng
        tertiary: "#36DA6D", // Màu xanh nhạt đậm
      },
    },
  },
  plugins: [],
};
