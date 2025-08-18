// API configuration for different environments
const getApiBaseUrl = (): string => {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  console.log('Environment check:', {
    DEV: import.meta.env.DEV,
    hostname: window.location.hostname,
    isDevelopment
  });
  
  // In development, use the proxy
  if (isDevelopment) {
    console.log('Using development API proxy: /api');
    return '/api';
  }
  
  // In production, use the Netlify function proxy to avoid CORS
  console.log('Using production Netlify function proxy: /.netlify/functions/api-proxy');
  return '/.netlify/functions/api-proxy';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to create full API URLs
export const createApiUrl = (endpoint: string): string => {
  const fullUrl = `${API_BASE_URL}/${endpoint}`;
  console.log('Creating API URL:', { endpoint, baseUrl: API_BASE_URL, fullUrl });
  return fullUrl;
};

export const getApiHeaders = () => {
  const { authorization } = { authorization: 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=' };
  return {
    'Authorization': authorization,
    'Content-Type': 'application/json',
  };
}; 