import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true, // Ensures Vite uses the specified port.
    cors: true, // Enables CORS in development.
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(), // Adds the componentTagger only in development mode.
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Allows usage of "@/..." in imports.
    },
  },
  build: {
    outDir: "dist", // Ensures compiled files are placed in the `dist` directory.
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  esbuild: {
    loader: "tsx", // Ensure TypeScript/TSX is correctly compiled.
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
  },
}));
