// API base URL from env (VITE_ prefix required for client-side access in Vite)
const envBase = import.meta.env.VITE_APP_API_BASE_ENDPOINT as string | undefined;

// Normalize: ensure no trailing slash for clean concatenation
const getApiBaseUrl = (): string => {
<<<<<<< HEAD:app/utils/api.ts
  // In development, use the proxy to avoid CORS issues
  if (process.env.NODE_ENV === 'development') {
    return '/api';
  }
  
  // In production, use the direct API URL
  return 'https://aswinno.assetwise.co.th/APIUAT';
=======
	const base = (envBase || '').trim();
	if (!base) {
		console.warn('VITE_APP_API_BASE_ENDPOINT is not set. API calls will fail.');
		return '';
	}
	return base.replace(/\/+$/, '');
>>>>>>> main:src/utils/api.ts
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to create full API URLs
// When using PHP proxy (base ends with .php), use ?path= format to avoid CORS
export const createApiUrl = (endpoint: string): string => {
	const normalized = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
	const base = API_BASE_URL;
	if (!base) return '';
	const isProxy = base.endsWith('.php') || base.includes('api-proxy');
	return isProxy ? `${base}?path=${encodeURIComponent(normalized)}` : `${base}/${normalized}`;
};

export const getApiHeaders = () => {
	const { authorization } = { authorization: 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=' };
	return {
		'Authorization': authorization,
		'Content-Type': 'application/json',
	};
}; 