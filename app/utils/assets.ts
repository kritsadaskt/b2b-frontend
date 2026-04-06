/**
 * Returns the correct path for public assets, respecting Vite's base URL.
 * Use this for images and other files in the public folder.
 */
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
