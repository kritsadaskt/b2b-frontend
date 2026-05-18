import { getProvinceName } from './thailandProvinces';

export interface SupplierAddressFields {
  address?: string | null;
  city?: string | null;
  province?: number | null;
  district?: number | null;
  subDistrict?: number | null;
  province_name?: string | null;
  district_name?: string | null;
  subDistrict_name?: string | null;
}

function pickName(
  explicitName: string | null | undefined,
  id: number | null | undefined,
  resolveId?: (id: number) => string | undefined,
): string | null {
  if (explicitName?.trim()) return explicitName.trim();
  if (id != null && id > 0 && resolveId) {
    return resolveId(id) ?? null;
  }
  return null;
}

/** รวมที่อยู่สำหรับแสดงในตาราง (ถนน + ตำบล/แขวง + อำเภอ/เขต + จังหวัด) */
export function formatSupplierAddress(item: SupplierAddressFields): string {
  const parts: string[] = [];
  const street = item.address?.trim();
  if (street) parts.push(street);

  const subDistrict = pickName(item.subDistrict_name, item.subDistrict);
  const district = pickName(item.district_name, item.district);
  const province =
    pickName(item.province_name, item.province, getProvinceName) ||
    item.city?.trim() ||
    null;

  const isBangkok = item.province === 10;

  if (subDistrict) {
    parts.push(isBangkok ? `แขวง${subDistrict}` : `ต.${subDistrict}`);
  }
  if (district) {
    parts.push(isBangkok ? `เขต${district}` : `อ.${district}`);
  }
  if (province) {
    parts.push(isBangkok ? province : `จ.${province}`);
  }

  return parts.length > 0 ? parts.join(' ') : '—';
}

export function formatOptionalText(value: string | null | undefined, fallback = '—'): string {
  if (value == null) return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}
