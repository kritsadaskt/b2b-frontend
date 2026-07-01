'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutList,
  LayoutGrid,
  Users,
  MapPin,
} from 'lucide-react';
import Select from 'react-select';
import { useGetData, useGetSupplierMediaTypeList, useGetSupplierTypeList } from '../hooks/getData';
import { Business } from '../utils/types';
import {
  transformSuppliersToBusiness,
  filterPartners,
  getTypeName,
  getProvinceDistrictLabel,
} from '../utils/partnerTransform';
import { sortPartners, PARTNER_SORT_OPTIONS, type PartnerSortOption } from '../utils/partnerSort';
import { exportToCSV } from '../utils/exportCsv';
import { PROVINCE_SELECT_OPTIONS } from '../utils/thailandProvinces';
import {
  findDistrictOption,
  getDistrictOptions,
  locationSelectStyles,
} from '../utils/thailandLocations';
import type { SupplierTypeItem } from '../utils/supplierTypeCache';
import CopyableText from './CopyableText';

type ViewMode = 'list' | 'cards';

function MediaTags({ mediaList }: { mediaList: Business['MediaList'] }) {
  if (!mediaList?.length) {
    return <span className="text-gray-400">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {mediaList.map((media) => (
        <span
          key={media.id}
          className="inline-flex items-center rounded bg-[#123F6D]/10 px-2.5 py-0.5 font-medium text-xs text-[#123F6D]"
        >
          {media.name}
        </span>
      ))}
    </div>
  );
}

export default function PartnersListedPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilterId, setTypeFilterId] = useState<number | null>(null);
  const [provinceFilterId, setProvinceFilterId] = useState<number | null>(null);
  const [districtFilterId, setDistrictFilterId] = useState<number | null>(null);
  const [mediaFilterIds, setMediaFilterIds] = useState<number[]>([]);
  const [partnerSort, setPartnerSort] = useState<PartnerSortOption>('name_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: businessData, loading: loadingData, error: errorData, refetch } = useGetData({
    supplier_name: '',
    is_active: true,
  });
  const {
    data: supplierTypeList = [],
    loading: loadingSupplierTypeList,
  } = useGetSupplierTypeList() as { data: SupplierTypeItem[]; loading: boolean };
  const {
    data: supplierMediaTypeList,
    loading: loadingSupplierMediaTypeList,
  } = useGetSupplierMediaTypeList();

  useEffect(() => {
    try {
      setBusinesses(transformSuppliersToBusiness(businessData));
      setError(null);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      console.error('Error loading partners:', err);
    }
  }, [businessData]);

  const filteredBusinesses = filterPartners(businesses, {
    searchTerm,
    typeFilterId,
    provinceFilterId,
    districtFilterId,
    mediaFilterIds,
  });

  const supplierTypeFilterOptions = supplierTypeList.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  const districtFilterOptions = getDistrictOptions(provinceFilterId);

  const mediaFilterOptions = supplierMediaTypeList.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  const sortedBusinesses = useMemo(
    () => sortPartners(filteredBusinesses, partnerSort),
    [filteredBusinesses, partnerSort],
  );

  const totalItems = sortedBusinesses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedBusinesses.slice(startIndex, endIndex);

  const hasActiveFilters =
    searchTerm.length > 0 ||
    typeFilterId != null ||
    provinceFilterId != null ||
    districtFilterId != null ||
    mediaFilterIds.length > 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilterId, provinceFilterId, districtFilterId, mediaFilterIds, partnerSort]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const exportData = sortedBusinesses.map((business) => ({
      companyName: business.companyName,
      typeName: getTypeName(business.type_id, supplierTypeList),
      provinceDistrict: getProvinceDistrictLabel(business),
      fullAddress: business.fullAddress,
      contactName: business.contactName,
      email: business.email,
      phone: business.phone,
      employees: business.employees,
      MediaList: business.MediaList,
      createdAt: business.createdAt,
    }));

    const headers = [
      { key: 'companyName', label: 'ชื่อบริษัท' },
      { key: 'typeName', label: 'ประเภท' },
      { key: 'provinceDistrict', label: 'จังหวัด/เขต' },
      { key: 'fullAddress', label: 'ที่อยู่' },
      { key: 'contactName', label: 'ผู้ติดต่อ' },
      { key: 'email', label: 'อีเมล' },
      { key: 'phone', label: 'เบอร์โทร' },
      { key: 'employees', label: 'จำนวนพนักงาน' },
      { key: 'MediaList', label: 'สื่อ' },
      { key: 'createdAt', label: 'วันที่สร้าง' },
    ];

    exportToCSV(exportData, 'partners_listed', headers);
  };

  const renderEmptyMessage = () =>
    hasActiveFilters ? 'ไม่พบข้อมูล Partner ที่ตรงกับตัวกรอง' : 'ไม่พบข้อมูล Partner';

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#123F6D]">รายชื่อ Partners</h1>
          <p className="mt-2 text-gray-600">
            เลือก Partner สำหรับแคมเปญและดูช่องทางติดต่อประชาสัมพันธ์
          </p>
        </div>

        {/* Filters + view toggle + export */}
        <div className="mb-6 flex flex-col lg:flex-row flex-wrap items-start justify-between gap-4">
          <div className="flex flex-1 flex-wrap items-center gap-4 min-w-0">
            <div className="relative w-full lg:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, ผู้ติดต่อ, อีเมล, ที่อยู่..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
              />
            </div>
            <div className="w-full sm:w-56 min-w-[150px]">
              <Select
                isClearable
                value={
                  provinceFilterId != null
                    ? PROVINCE_SELECT_OPTIONS.find((o) => o.value === provinceFilterId) ?? null
                    : null
                }
                onChange={(selected) => {
                  setProvinceFilterId(selected?.value ?? null);
                  setDistrictFilterId(null);
                }}
                options={PROVINCE_SELECT_OPTIONS}
                placeholder="จังหวัด"
                className="w-full"
                classNamePrefix="react-select"
                styles={locationSelectStyles}
              />
            </div>
            <div className="w-full sm:w-56 min-w-[150px]">
              <Select
                isClearable
                isDisabled={provinceFilterId == null}
                value={findDistrictOption(districtFilterId, provinceFilterId)}
                onChange={(selected) => setDistrictFilterId(selected?.value ?? null)}
                options={districtFilterOptions}
                placeholder={provinceFilterId != null ? 'เขต/อำเภอ' : 'เลือกจังหวัดก่อน'}
                className="w-full"
                classNamePrefix="react-select"
                styles={locationSelectStyles}
              />
            </div>
            <div className="w-full sm:w-56 min-w-[150px]">
              <Select
                isClearable
                isLoading={loadingSupplierTypeList}
                value={
                  typeFilterId != null
                    ? supplierTypeFilterOptions.find((o) => o.value === typeFilterId) ?? null
                    : null
                }
                onChange={(selected) => setTypeFilterId(selected?.value ?? null)}
                options={supplierTypeFilterOptions}
                placeholder="ประเภท"
                className="w-full"
                classNamePrefix="react-select"
                styles={locationSelectStyles}
                noOptionsMessage={() =>
                  loadingSupplierTypeList ? 'กำลังโหลด...' : 'ไม่พบข้อมูล'
                }
              />
            </div>
            <div className="w-full sm:w-64 min-w-[150px]">
              <Select
                isMulti
                isClearable
                closeMenuOnSelect={false}
                isLoading={loadingSupplierMediaTypeList}
                value={mediaFilterOptions.filter((o) => mediaFilterIds.includes(o.value))}
                onChange={(selected) =>
                  setMediaFilterIds(selected ? selected.map((o) => o.value) : [])
                }
                options={mediaFilterOptions}
                placeholder="สื่อ"
                className="w-full"
                classNamePrefix="react-select"
                styles={locationSelectStyles}
                noOptionsMessage={() =>
                  loadingSupplierMediaTypeList ? 'กำลังโหลด...' : 'ไม่พบข้อมูล'
                }
              />
            </div>
            <div className="w-full sm:w-56 min-w-[150px]">
              <Select
                value={
                  PARTNER_SORT_OPTIONS.find((o) => o.value === partnerSort) ??
                  PARTNER_SORT_OPTIONS[0]
                }
                onChange={(selected) =>
                  setPartnerSort((selected?.value as PartnerSortOption) ?? 'name_asc')
                }
                options={PARTNER_SORT_OPTIONS}
                placeholder="เรียงลำดับ"
                className="w-full"
                classNamePrefix="react-select"
                styles={locationSelectStyles}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#123F6D] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title="มุมมองรายการ"
              >
                <LayoutList className="h-4 w-4" />
                <span className="hidden sm:inline">รายการ</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 flex items-center gap-1.5 text-sm font-medium transition-colors border-l border-gray-300 ${
                  viewMode === 'cards'
                    ? 'bg-[#123F6D] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title="มุมมองการ์ด"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">การ์ด</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleExport}
              disabled={sortedBusinesses.length === 0}
              className="bg-[#123F6D] hover:bg-[#0f2f54] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300"
            >
              <Download className="h-5 w-5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {loadingData ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#123F6D] mx-auto" />
            <p className="text-gray-600 mt-4">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error || errorData ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-red-600 mb-4">{error || errorData}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="bg-[#123F6D] hover:bg-[#0f2f54] text-white px-4 py-2 rounded-lg transition-colors"
            >
              ลองใหม่
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่อบริษัท
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ประเภท
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จังหวัด / เขต
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ผู้ติดต่อ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      อีเมล
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      เบอร์โทร
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สื่อ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      พนักงาน
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        {renderEmptyMessage()}
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((business) => (
                      <tr key={business.uid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building2 className="h-5 w-5 text-[#123F6D] mr-3 flex-shrink-0" />
                            <div className="text-sm font-medium text-gray-900">
                              {business.companyName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getTypeName(business.type_id, supplierTypeList)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getProvinceDistrictLabel(business)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {business.contactName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <CopyableText value={business.email} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <CopyableText value={business.phone} />
                        </td>
                        <td className="px-6 py-4 min-w-[200px]">
                          <MediaTags mediaList={business.MediaList} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {business.employees}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </div>
        ) : (
          <div>
            {currentItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                {renderEmptyMessage()}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((business) => (
                  <div
                    key={business.uid}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <Building2 className="h-6 w-6 text-[#123F6D] flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900 leading-snug">
                          {business.companyName}
                        </h3>
                        <span className="inline-flex mt-1.5 items-center rounded bg-[#123F6D]/10 px-2.5 py-0.5 text-xs font-medium text-[#123F6D]">
                          {getTypeName(business.type_id, supplierTypeList)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-gray-400" />
                      <div>
                        <p>{getProvinceDistrictLabel(business)}</p>
                        {business.fullAddress !== '—' && (
                          <p className="text-gray-500 mt-0.5">{business.fullAddress}</p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-500">ผู้ติดต่อ: </span>
                        <span className="text-gray-900">{business.contactName}</span>
                      </p>
                      <div className="text-sm flex items-center gap-1.5">
                        <span className="text-gray-500">อีเมล: </span>
                        <CopyableText value={business.email} />
                      </div>
                      <div className="text-sm flex items-center gap-1.5">
                        <span className="text-gray-500">เบอร์โทร: </span>
                        <CopyableText value={business.phone} />
                      </div>
                      <p className="text-sm flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">พนักงาน: </span>
                        {Number(business.employees) === 0 ? (
                          <span className="text-gray-900">ไม่ระบุ</span>
                        ) : (
                          <span className="text-gray-900">
                            {Number(business.employees).toLocaleString('en-US')} คน
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs text-gray-500 mb-2">ช่องทางสื่อ</p>
                      <MediaTags mediaList={business.MediaList} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {totalItems > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
                {renderPagination()}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );

  function renderPagination() {
    if (totalItems === 0) return null;

    return (
      <div className="px-6 py-4 border-t border-gray-200 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">แสดง</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="hidden lg:block text-sm text-gray-700">รายการต่อหน้า</span>
          </div>
          <div className="text-sm text-gray-700">
            แสดง {startIndex + 1} ถึง {Math.min(endIndex, totalItems)} จาก {totalItems}{' '}
            <span className="hidden lg:inline">รายการ</span>
            {searchTerm && (
              <span className="hidden lg:inline"> (กรองจากการค้นหา &quot;{searchTerm}&quot;)</span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    currentPage === pageNum
                      ? 'bg-[#123F6D] text-white'
                      : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }
}
