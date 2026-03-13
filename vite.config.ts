import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    // Keep assets at the site root; routing handles `/partners/`
    base: '/partners/',
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      // Security and optimization configurations for production
      minify: mode === 'production' ? 'terser' : false,
      terserOptions:
        mode === 'production'
          ? {
              compress: {
                drop_console: true,
                drop_debugger: true,
              },
              mangle: {
                toplevel: true,
              },
            }
          : undefined,
      // Disable source maps in production for security
      sourcemap: mode !== 'production',
      // Configure chunk splitting for better performance
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunk for large libraries
            vendor: ['react', 'react-dom', 'react-router-dom'],
            // UI libraries
            ui: ['lucide-react', 'react-select'],
            // Utilities
            utils: ['xlsx'],
          },
        },
      },
      // Increase chunk size warning limit to 600kb
      chunkSizeWarningLimit: 600,
    },
    // Vite proxy for development only (avoids CORS issues in local dev)
    // Production builds use direct API calls via VITE_APP_API_BASE_ENDPOINT
    server: {
      proxy: {
        '/api': {
          target: 'https://api.assetwise.co.th',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
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
        },
      },
    },
    // Define environment variables that are safe to expose
    // define: {
    //   'import.meta.env.VITE_API_USERNAME': JSON.stringify(process.env.VITE_API_USERNAME || 'supplier'),
    //   'import.meta.env.VITE_API_PASSWORD': JSON.stringify(process.env.VITE_API_PASSWORD || 'supplier@2025'),
    // },
  };
});
