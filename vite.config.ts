import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    outDir: "dist",
    rollupOptions: {
      input: "./src/main.ts",
    },
  },
});
