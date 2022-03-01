import path from "path";
import { defineConfig } from "vite";

const baseDir = `./release`;

export default defineConfig({
  build: {
    manifest: true,
    base: baseDir,
    rollupOptions: {
      input: "src/main.js"
    }
  },
  resolve: {
    alias: [{ find: "~", replacement: path.resolve(__dirname, "src") }]
  }
});
