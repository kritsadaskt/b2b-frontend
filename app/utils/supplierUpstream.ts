/**
 * Server-only upstream base for Supplier B2B API (proxied via app/api and rewrites).
 * Override with SUPPLIER_API_BASE_URL in .env (no trailing slash).
 */
export function getSupplierApiBaseUrl(): string {
  return (process.env.SUPPLIER_API_BASE_URL || 'https://aswinno.assetwise.co.th/APIUAT').replace(
    /\/+$/,
    '',
  );
}

export function supplierApiUpstreamUrl(pathUnderBase: string): string {
  const p = pathUnderBase.replace(/^\//, '');
  return `${getSupplierApiBaseUrl()}/${p}`;
}
