import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isProd = process.env.NODE_ENV === "production";

/**
 *  @type {import('vite').UserConfig}
 */
const config = defineConfig({
  plugins: [react()],
  build:{
    outDir: "../../api/src/public/dist",
  },
  server: {
    host: "localhost",
    proxy: {
      "/api": {
        target: "http://localhost:8801",
        changeOrigin: true,
        secure: false,
        logLevel: "debug",
      },
    },
  },
});

if(isProd) {
  delete config.server;
}

export default config;