import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Security configurations for production
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true, // Remove debugger statements
      },
      mangle: {
        // Mangle variable names to make debugging harder
        toplevel: true,
      },
    } : undefined,
    // Disable source maps in production for security
    sourcemap: mode !== 'production',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.assetwise.co.th/',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          // Only log proxy details in development
          if (mode === 'development') {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          }
        },
      }
    }
  },
  // Define environment variables that are safe to expose
  // define: {
  //   'import.meta.env.VITE_API_USERNAME': JSON.stringify(process.env.VITE_API_USERNAME || 'supplier'),
  //   'import.meta.env.VITE_API_PASSWORD': JSON.stringify(process.env.VITE_API_PASSWORD || 'supplier@2025'),
  // },
}));
