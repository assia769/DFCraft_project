// vite.config.background.js
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  build: {
    outDir: 'dist/background',
    rollupOptions: {
      input: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/background/background.js'),
      output: {
        entryFileNames: 'background.js',
        inlineDynamicImports: true, // tout sera dans background.js
      },
    },
  },
})
