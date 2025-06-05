// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'demo',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/GenieAssistant.js'),
      name: 'GenieAssistant',
      fileName: 'genie-assistant',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        globals: {}
      }
    }
  },
  server: {
    port: 5173
  },
  preview: {
    port: 4173,
    open: true // Automatically open browser
  }
});
