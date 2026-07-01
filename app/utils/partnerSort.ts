import type { Business } from './types';

export type PartnerSortOption = 'name_asc' | 'name_desc' | 'created_desc' | 'created_asc';

export const PARTNER_SORT_OPTIONS: { value: PartnerSortOption; label: string }[] = [
  { value: 'name_asc', label: 'ชื่อ A → Z' },
  { value: 'name_desc', label: 'ชื่อ Z → A' },
  { value: 'created_desc', label: 'วันที่สร้าง ใหม่ → เก่า' },
  { value: 'created_asc', label: 'วันที่สร้าง เก่า → ใหม่' },
];

export function sortPartners(businesses: Business[], sort: PartnerSortOption): Business[] {
  const list = [...businesses];
  switch (sort) {
    case 'name_asc':
      return list.sort((a, b) =>
        a.companyName.localeCompare(b.companyName, 'th', { sensitivity: 'base' }),
      );
    case 'name_desc':
      return list.sort((a, b) =>
        b.companyName.localeCompare(a.companyName, 'th', { sensitivity: 'base' }),
      );
    case 'created_desc':
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'created_asc':
      return list.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    default:
      return list;
  }
}
