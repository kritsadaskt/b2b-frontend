// API configuration for different environments
const getApiBaseUrl = (): string => {
  // In development, use the proxy
  if (import.meta.env.DEV) {
    return '/api';
  }
  
  // In production, use the direct API URL
  return 'https://api.assetwise.co.th/';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to create full API URLs
export const createApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};


export const getApiHeaders = () => {
  const { authorization } = { authorization: 'Basic ' };
  return {
    'Authorization': authorization,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
}; 