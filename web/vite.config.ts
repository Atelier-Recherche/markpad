import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["@codemirror/state", "@codemirror/view", "codemirror", "y-codemirror.next"]
  },
  server: {
    proxy: {
      "^/admin/(shares|users|settings|sessions)": {
        target: "http://localhost:1234",
        changeOrigin: true
      }
    }
  }
});
