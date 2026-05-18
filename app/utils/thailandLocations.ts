import districtsData from './districts.json';
import subDistrictsData from './subdistricts.json';

export type LocationSelectOption = { value: number; label: string };

export interface DistrictRecord {
  id: number;
  provinceCode: number;
  districtCode: number;
  districtNameEn: string;
  districtNameTh: string;
  postalCode: number;
}

export interface SubDistrictRecord {
  id: number;
  provinceCode: number;
  districtCode: number;
  subdistrictCode: number;
  subdistrictNameEn: string;
  subdistrictNameTh: string;
  postalCode: number;
}

export const districts = districtsData as DistrictRecord[];
export const subDistricts = subDistrictsData as SubDistrictRecord[];

export const locationSelectStyles = {
  control: (provided: Record<string, unknown>) => ({
    ...provided,
    minHeight: '50px',
    borderRadius: '8px',
  }),
};

export function getDistrictOptions(provinceCode: number | null | undefined): LocationSelectOption[] {
  if (provinceCode == null) return [];
  return districts
    .filter((d) => d.provinceCode === provinceCode)
    .map((d) => ({ value: d.districtCode, label: d.districtNameTh }));
}

export function getSubDistrictOptions(
  provinceCode: number | null | undefined,
  districtCode: number | null | undefined,
): LocationSelectOption[] {
  if (districtCode == null) return [];
  return subDistricts
    .filter(
      (s) =>
        s.districtCode === districtCode &&
        (provinceCode == null || s.provinceCode === provinceCode),
    )
    .map((s) => ({ value: s.subdistrictCode, label: s.subdistrictNameTh }));
}

export function findDistrictOption(
  districtCode: number | null | undefined,
  provinceCode?: number | null,
): LocationSelectOption | null {
  if (districtCode == null) return null;
  const district = districts.find(
    (d) =>
      d.districtCode === districtCode &&
      (provinceCode == null || d.provinceCode === provinceCode),
  );
  return district ? { value: district.districtCode, label: district.districtNameTh } : null;
}

export function findSubDistrictOption(
  subdistrictCode: number | null | undefined,
  districtCode?: number | null,
  provinceCode?: number | null,
): LocationSelectOption | null {
  if (subdistrictCode == null) return null;
  const subDistrict = subDistricts.find(
    (s) =>
      s.subdistrictCode === subdistrictCode &&
      (districtCode == null || s.districtCode === districtCode) &&
      (provinceCode == null || s.provinceCode === provinceCode),
  );
  return subDistrict
    ? { value: subDistrict.subdistrictCode, label: subDistrict.subdistrictNameTh }
    : null;
}
