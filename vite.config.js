import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    open: false,
    proxy: {
      // Proxy /api requests to the backend running on :8000
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      usePolling: true,
      interval: 1000,  // Reducir frecuencia de polling
      ignored: ['**/node_modules/**', '**/dist/**'] // Ignorar carpetas innecesarias
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router'],
    exclude: ['@vite/client', '@vite/env'] // Excluir dependencias no necesarias
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false, // Deshabilitar sourcemaps en producción
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'utils': ['./src/composables/apiClient.js', './src/composables/propertyApiService.js']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 600,
    assetsInlineLimit: 4096 // Inline assets menores a 4KB
  },
  esbuild: {
    pure: ['console.log'], // Remover console.log en producción
    drop: ['debugger'], // Remover debugger statements
  },
  // Optimización de memoria para desarrollo
  define: {
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
  }
})
