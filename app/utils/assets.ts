/**
 * Path for files in `public/`. If the app uses `basePath`, set NEXT_PUBLIC_BASE_PATH to match.
 */
export const asset = (path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const prefix = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return prefix ? `${prefix}${normalized}` : normalized;
};
