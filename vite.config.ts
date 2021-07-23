import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { resolve } from "path";
import copy from "rollup-plugin-copy";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [reactRefresh()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          background: resolve(__dirname, "src/background.js"),
        },
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
        plugins: [
          copy({
            targets: [
              {
                src: `manifest/manifest.${
                  mode === "production" ? "prod" : "dev"
                }.json`,
                dest: "dist",
                rename: "manifest.json",
              },
            ],
            hook: "writeBundle",
          }),
        ],
      },
    },
  };
});
