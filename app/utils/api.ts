// API configuration for different environments
const getApiBaseUrl = (): string => {
  // In development, use the proxy to avoid CORS issues
  if (process.env.NODE_ENV === 'development') {
    return '/api';
  }
  
  // In production, use the direct API URL
  return 'https://aswinno.assetwise.co.th/APIUAT';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to create full API URLs
export const createApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export const apiHeaders = {
  'Authorization': 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=',
  'Content-Type': 'application/x-www-form-urlencoded',
}; 