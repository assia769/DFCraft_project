import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/popup/popup.html'),
        options: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/options/options.html'),
        background: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/background/background.js'),
        content: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/content/contentScript.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
})