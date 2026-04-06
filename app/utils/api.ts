const PROD_API_BASE = 'https://aswinno.assetwise.co.th/APIUAT';

// In development, Next rewrites `/api/*` (see next.config.js). In production, use env or default.
const getApiBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return '/api';
  }

  const envBase = (process.env.NEXT_PUBLIC_APP_API_BASE_ENDPOINT || '').trim();
  if (envBase) {
    return envBase.replace(/\/+$/, '');
  }

  return PROD_API_BASE;
};

export const API_BASE_URL = getApiBaseUrl();

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
    Authorization: authorization,
    'Content-Type': 'application/json',
  };
};
