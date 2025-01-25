import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isProd = process.env.NODE_ENV === "production";

/**
 *  @type {import('vite').UserConfig}
 */
const config = defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "../../api/src/public/dist",
    emptyOutDir: true,
  },
  server: {
    host: "localhost",
    proxy: {
      "/api": {
        target: "http://localhost:8801", // Backend server for API routes
        changeOrigin: true,
        secure: false,
        logLevel: "debug",
      },
      "/images": {
        target: "http://localhost:8801", // Backend server for images
        changeOrigin: true,
        secure: false,
        logLevel: "debug",
      },
    },
  },
});

if (isProd) {
  delete config.server; // Remove dev server configuration for production
}

export default config;
