import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    }),
    compression({
      algorithm: 'brotli',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  
  build: {
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 1000
  },

  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },

  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'axios',
      'zustand'
    ]
  }
})


