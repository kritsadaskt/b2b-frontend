import type { Business, Supplier } from './types';
import { formatOptionalText, formatSupplierAddress } from './supplierAddress';
import { getProvinceName } from './thailandProvinces';
import { findDistrictOption } from './thailandLocations';
import type { SupplierTypeItem } from './supplierTypeCache';

export function transformSuppliersToBusiness(suppliers: Supplier[]): Business[] {
  if (!Array.isArray(suppliers)) return [];

  return suppliers
    .filter((item) => item.is_active === true)
    .map((item, index) => ({
      uid: item.uid || `business-${index}`,
      companyName: formatOptionalText(item.supplier_name),
      contactName: formatOptionalText(item.sales_person),
      email: formatOptionalText(item.email),
      fullAddress: formatSupplierAddress(item),
      streetAddress: item.address?.trim() ?? '',
      city: item.city?.trim() ?? '',
      province: item.province ?? null,
      district: item.district ?? null,
      subDistrict: item.subDistrict ?? null,
      remark: formatOptionalText(item.remark),
      is_active: item.is_active === true,
      phone: formatOptionalText(item.telephone),
      employees: item.head_count != null ? String(item.head_count) : '—',
      type_id: item.type_id || 0,
      StatusList: item.StatusList || [],
      createdAt: item.contact_date || new Date().toISOString(),
      MediaList: item.MediaList || [],
    }));
}

export function getTypeName(
  typeId: number,
  supplierTypeList: SupplierTypeItem[],
): string {
  const match = supplierTypeList.find((t) => t.id === typeId);
  return match?.name ?? '—';
}

export function getProvinceDistrictLabel(business: Business): string {
  const provinceName = getProvinceName(business.province) ?? '—';
  const districtOption = findDistrictOption(business.district, business.province);
  const districtName = districtOption?.label;

  if (districtName && provinceName !== '—') {
    return `${provinceName} / ${districtName}`;
  }
  if (provinceName !== '—') return provinceName;
  if (districtName) return districtName;
  return '—';
}

export function filterPartners(
  businesses: Business[],
  filters: {
    searchTerm: string;
    typeFilterId: number | null;
    provinceFilterId: number | null;
    districtFilterId: number | null;
    mediaFilterIds: number[];
  },
): Business[] {
  const { searchTerm, typeFilterId, provinceFilterId, districtFilterId, mediaFilterIds } =
    filters;

  return businesses.filter((business) => {
    if (typeFilterId != null && business.type_id !== typeFilterId) {
      return false;
    }
    if (provinceFilterId != null && business.province !== provinceFilterId) {
      return false;
    }
    if (districtFilterId != null && business.district !== districtFilterId) {
      return false;
    }
    if (mediaFilterIds.length > 0) {
      const businessMediaIds = business.MediaList?.map((m) => m.id) ?? [];
      const hasSelectedMedia = mediaFilterIds.some((id) => businessMediaIds.includes(id));
      if (!hasSelectedMedia) return false;
    }
    const q = searchTerm.toLowerCase();
    if (!q) return true;
    return (
      business.companyName.toLowerCase().includes(q) ||
      business.contactName.toLowerCase().includes(q) ||
      business.email.toLowerCase().includes(q) ||
      business.fullAddress.toLowerCase().includes(q)
    );
  });
}
