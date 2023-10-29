import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue2";

import path from "path";

export default defineConfig({
  publicDir: "public",
  plugins: [
    vue(),
    legacy({
      targets: ["ie >= 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
  ],
  optimizeDeps: {
    exclude: ["vue-demi", "oh-vue-icons/icons"],
  },
  resolve: {
    alias: {
      "@": path.resolve("src"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/assets": path.resolve(__dirname, "src/assets"),
      "@/network": path.resolve(__dirname, "src/network"),
      "@/router": path.resolve(__dirname, "src/router"),
      "@/store": path.resolve(__dirname, "src/store"),
      "@/views": path.resolve(__dirname, "src/views"),
      "@/utils": path.resolve(__dirname, "src/utils"),
      "@/layouts": path.resolve(__dirname, "src/layouts"),
      "@/plugins": path.resolve(__dirname, "src/plugins"),
      "@/functions": path.resolve(__dirname, "src/functions"),
      "@/data": path.resolve(__dirname, "src/data"),
      "@core": path.resolve(__dirname, "src/@core"),
      "@themeConfig": path.resolve(__dirname, "src/themeConfig.js"),
    },
  },
  server: {
    port: 8080,
  },
  preview: {
    port: 8090,
  },
});
