
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild', // Minificación ultra-rápida habilitada
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separación de dependencias core (Vendor Chunk)
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
})
