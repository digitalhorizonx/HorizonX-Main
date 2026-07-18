import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        // The WebGL stack is isolated automatically by the dynamic import in
        // SceneLoader; listing it here (object form) would force a static
        // modulepreload edge from the entry and defeat the lazy load.
        manualChunks: {
          motion: ["gsap", "lenis"],
        },
      },
    },
  },
});
