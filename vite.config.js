import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  build: {
    // sépare three.js du reste : meilleur cache et chargement plus rapide
    rollupOptions: { output: { manualChunks: { three: ['three'] } } },
    chunkSizeWarningLimit: 1000,
  },
})
