import { defineConfig } from "vite";
// @ts-ignore
import path from "path";

export default defineConfig({
  root: __dirname,
  optimizeDeps: {
    exclude: ['@crux/context', '@crux/reactivity', '@crux/core']
  },
  server: {
    fs: {
      // 👇 Allow importing files from outside /playground
      allow: ['..']
    },
    open: true
  },
  build: { outDir: "dist" },
  resolve: {
    alias: {
      "@crux/reactivity": path.resolve(__dirname, "../packages/reactivity/src"),
      "@crux/core": path.resolve(__dirname, "../packages/core/src"),
      "@crux/context": path.resolve(__dirname, "../packages/context/src"),
      "@crux/forms": path.resolve(__dirname, "../packages/forms/src")
    }
  }
});