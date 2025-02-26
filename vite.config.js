import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174, // Changed port to avoid conflict
    strictPort: false, // Allow fallback to next available port
    // Allow all CodeSandbox domains
    allowedHosts: [
      '.csb.app',
      'localhost',
      '127.0.0.1'
    ],
    proxy: {
      // Proxy API requests
      '/api': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // Proxy Discord API requests
      '/discord-api': {
        target: process.env.VITE_DISCORD_API_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/discord-api/, '')
      }
    },
    // Hide network URLs from console
    logger: {
      transport: {
        target: 'console',
        options: {
          filterServe: (line) => !line.includes('Network:')
        }
      }
    },
    hmr: {
      // Configure HMR to work in CodeSandbox
      clientPort: 443
    }
  },
  // Additional security headers
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  }
})
