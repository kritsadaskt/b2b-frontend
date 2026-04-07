/**
 * Base path segment without slashes (e.g. '' or 'partners').
 * Env may be `/partners` or `partners` — we strip slashes so joining never yields `//partners/...`,
 * which browsers treat as protocol-relative (`http://partners/...`).
 */
export const getStaticPathPrefix = (): string => {
  return (process.env.NEXT_PUBLIC_BASE_PATH || '').trim().replace(/^\/+|\/+$/g, '');
};

/**
 * Absolute path to a file under `public/` (leading slash, includes basePath when set).
 */
export const publicAssetPath = (path: string): string => {
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  const prefix = getStaticPathPrefix();
  return prefix ? `/${prefix}/${normalized}` : `/${normalized}`;
};

export const asset = publicAssetPath;
