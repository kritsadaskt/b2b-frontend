/**
 * Prefix for URLs under `public/` (e.g. '' or '/partners').
 * Must match `basePath` in next.config.js — both read `NEXT_PUBLIC_BASE_PATH`.
 */
export const getStaticPathPrefix = (): string => {
  return (process.env.NEXT_PUBLIC_BASE_PATH || '').trim().replace(/\/$/, '');
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
