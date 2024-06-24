import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@public": path.resolve(__dirname, "./public"),
    },
  },
  // server: {
  //   proxy: {
  //     "/api": {
  //       //target: "http://sensingapi.cusc.vn",
  //       target: "http://localhost:8000",
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
});
