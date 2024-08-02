import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://orca-ai-nu.vercel.app", // Ensure this matches your backend server port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
