// Browser calls must use same-origin `/api/*` so Next rewrites (next.config.js) or app/api
// route handlers proxy upstream. Pointing `NEXT_PUBLIC_*` at the real API host causes
// cross-origin requests and CORS failures on Vercel.
const getApiBaseUrl = (): string => {
  const envBase = (process.env.NEXT_PUBLIC_APP_API_BASE_ENDPOINT || '').trim();
  if (envBase) {
    return envBase.replace(/\/+$/, '');
  }
  return '/api';
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
