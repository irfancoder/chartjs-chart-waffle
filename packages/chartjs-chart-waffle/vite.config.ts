import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "chartjs-chart-waffle",
      fileName: (format) => `chartjs-chart-waffle.${format}.js`,
      formats: ["es", "umd"],
    },
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      treeshake: true,
      external: ["chart.js"],
      output: {
        globals: {
          "chart.js": "chart.js",
        },
        format: "esm",
        esModule: true,
      },
    },
  },
});
