// API configuration for different environments
const getApiBaseUrl = (): string => {
	// Check if we're in development mode
	const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

	// In development, use Vite proxy
	if (isDevelopment) {
		return '/api';
	}

	// In production, use Netlify rewrite proxy (avoids CORS)
	return '/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to create full API URLs
export const createApiUrl = (endpoint: string): string => {
	const normalized = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
	return `${API_BASE_URL}/${normalized}`;
};

export const getApiHeaders = () => {
	const { authorization } = { authorization: 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=' };
	return {
		'Authorization': authorization,
		'Content-Type': 'application/json',
	};
}; 