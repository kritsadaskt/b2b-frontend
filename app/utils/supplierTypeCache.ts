import { createApiUrl, getApiHeaders } from './api';

export interface SupplierTypeItem {
  id: number;
  name: string;
}

interface SupplierTypeCacheEntry {
  version: number;
  fetchedAt: number;
  data: SupplierTypeItem[];
}

const CACHE_VERSION = 1;
const CACHE_KEY = 'b2b_supplier_type_list';
/** Reference data — refresh at most once per session day */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

let memoryCache: SupplierTypeItem[] | null = null;
let memoryCacheFetchedAt = 0;

function normalizeSupplierTypes(raw: unknown[]): SupplierTypeItem[] {
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      const id = Number(row.id ?? row.type_id);
      const name = String(row.name ?? row.type_name ?? row.supplier_name ?? '').trim();
      if (!Number.isFinite(id) || !name) return null;
      return { id, name };
    })
    .filter((item): item is SupplierTypeItem => item !== null);
}

function isFresh(fetchedAt: number): boolean {
  return Date.now() - fetchedAt < CACHE_TTL_MS;
}

function readSessionCache(): SupplierTypeItem[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as SupplierTypeCacheEntry;
    if (entry.version !== CACHE_VERSION || !Array.isArray(entry.data) || !isFresh(entry.fetchedAt)) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return entry.data;
  } catch {
    sessionStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function writeSessionCache(data: SupplierTypeItem[]): void {
  if (typeof window === 'undefined') return;
  const entry: SupplierTypeCacheEntry = {
    version: CACHE_VERSION,
    fetchedAt: Date.now(),
    data,
  };
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
}

export function getCachedSupplierTypes(): SupplierTypeItem[] | null {
  if (memoryCache && isFresh(memoryCacheFetchedAt)) {
    return memoryCache;
  }
  const session = readSessionCache();
  if (session) {
    memoryCache = session;
    memoryCacheFetchedAt = Date.now();
    return session;
  }
  return null;
}

export function setCachedSupplierTypes(data: SupplierTypeItem[]): void {
  memoryCache = data;
  memoryCacheFetchedAt = Date.now();
  writeSessionCache(data);
}

export function clearSupplierTypeCache(): void {
  memoryCache = null;
  memoryCacheFetchedAt = 0;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(CACHE_KEY);
  }
}

export async function fetchSupplierTypeList(options?: {
  force?: boolean;
}): Promise<SupplierTypeItem[]> {
  if (!options?.force) {
    const cached = getCachedSupplierTypes();
    if (cached) return cached;
  }

  const response = await fetch(createApiUrl('Suplier/GetSuplierTypeList'), {
    method: 'GET',
    headers: {
      ...getApiHeaders(),
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch supplier type list: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  const data = normalizeSupplierTypes(result.Data || []);
  setCachedSupplierTypes(data);
  return data;
}
