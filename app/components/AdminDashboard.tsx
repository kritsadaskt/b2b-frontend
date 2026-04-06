import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Building2, X, Search, SquarePen, ChevronDown, Upload, ChevronLeft, ChevronRight, Users, Download } from 'lucide-react';
import { authService } from '../utils/auth';
import { Supplier, Business } from '../utils/types';
import { useGetData, useGetSupplierMediaTypeList, useGetSupplierStatusList, useGetSupplierTypeList, useGetApiLeads } from '../hooks/getData';
import Select from 'react-select';
import { useSaveData } from '../hooks/saveData';
import AlertPopup from './AlertPopup';
import CsvUploadDialog from '../components/CsvUploadDialog';
// import ApiTest from './ApiTest';
// import FunctionTest from './FunctionTest';

interface DataResponse {
  Data: Supplier[];
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'businesses' | 'leads'>('businesses');
  const [newBusiness, setNewBusiness] = useState<Supplier>({
    uid: '',
    supplier_name: '',
    sales_person: '',
    email: '',
    telephone: '',
    head_count: 0,
    type_id: 0,
    address: '',
    city: '',
    remark: '',
    media_remark: '',
    MediaList: [],
    StatusList: [],
    type_name: '',
    contact_date: '',
    update_time: '',
    business_type: '',
    is_active: true,
  });
  const [editBusiness, setEditBusiness] = useState<Business>({
    uid: '',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    employees: '',
    type_id: 0,
    address: '',
    city: '',
    remark: '',
    StatusList: [],
    createdAt: '',
    MediaList: [],
  });
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const [alertPopupType, setAlertPopupType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [alertPopupTitle, setAlertPopupTitle] = useState('');
  const [alertPopupText, setAlertPopupText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCsvUploadDialog, setShowCsvUploadDialog] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: bussinessData, loading: loadingData, error: errorData, refetch: refetchBusinesses } = useGetData();
  const { data: leadsData, loading: loadingLeads, error: errorLeads, refetch: refetchLeads } = useGetApiLeads();
  //const { data: supplierTypeList, loading: loadingSupplierTypeList, error: errorSupplierTypeList, refetch: refetchSupplierTypeList } = useGetSupplierTypeList();
  const supplierTypeList = [
    { id: 1, name: 'Bank' },
    { id: 2, name: 'องค์กร' },
    { id: 3, name: 'ASW Partner' },
    { id: 4, name: 'sponsor' },
    { id: 5, name: 'other' }
  ]
  const { data: supplierMediaTypeList, loading: loadingSupplierMediaTypeList, error: errorSupplierMediaTypeList, refetch: refetchSupplierMediaTypeList } = useGetSupplierMediaTypeList();
  const saveDataResult = useSaveData(newBusiness);
  const updateDataResult = useSaveData({
    ...newBusiness,
    supplier_name: editBusiness.companyName,
    sales_person: editBusiness.contactName,
    telephone: editBusiness.phone,
    head_count: parseInt(editBusiness.employees) || 0,
    uid: editBusiness.uid,
    email: editBusiness.email,
    address: editBusiness.address,
    city: editBusiness.city,
    remark: editBusiness.remark,
    type_id: editBusiness.type_id,
    MediaList: editBusiness.MediaList,
    StatusList: editBusiness.StatusList,
    type_name: '',
    contact_date: editBusiness.createdAt,
    update_time: new Date().toISOString(),
    business_type: '',
    is_active: true,
    media_remark: ''
  });
  const { data: saveData = [], loading: loadingSaveData = false, error: errorSaveData = null, refetch: refetchSaveData } = saveDataResult || {};
  const { data: updateData = [], loading: loadingUpdateData = false, error: errorUpdateData = null, refetch: refetchUpdateData } = updateDataResult || {};
  const { data: supplierStatusList, loading: loadingSupplierStatusList, error: errorSupplierStatusList, refetch: refetchSupplierStatusList } = useGetSupplierStatusList();


  useEffect(() => {
    fetchBusinesses();
  }, [bussinessData]);
  
  // Session timer effect
  useEffect(() => {
    const updateSessionTime = () => {
      const remainingTime = authService.getRemainingTime();
      
      // Auto logout when session expires
      if (remainingTime === 0) {
        alert('Your session has expired. Please log in again.');
        onLogout();
      }
    };

    // Update immediately
    updateSessionTime();
    
    // Update every minute
    const interval = setInterval(updateSessionTime, 60000);
    
    return () => clearInterval(interval);
  }, [onLogout]);

  const fetchBusinesses = async () => {
    try {
      // console.log(bussinessData);

      // Transform API data to match our interface
      const transformedData = Array.isArray(bussinessData) ? bussinessData
        .sort((a, b) => {
          const dateA = new Date(a.contact_date || 0);
          const dateB = new Date(b.contact_date || 0);
          return dateB.getTime() - dateA.getTime(); // Sort descending (newest first)
        })
        .map((item: Supplier, index: number) => ({
          uid: item.uid || `business-${index}`,
          companyName: item.supplier_name || 'N/A',
          contactName: item.sales_person || 'N/A', 
          email: item.email || 'N/A',
          address: item.address || 'N/A',
          city: item.city || 'N/A',
          remark: item.remark || 'N/A',
          phone: item.telephone || 'N/A',
          employees: item.head_count.toString() || 'N/A',
          type_id: item.type_id || 0,
          StatusList: item.StatusList || [],
          createdAt: item.contact_date || new Date().toISOString(),
          MediaList: item.MediaList || []
        } as Business)) : [];
      
      setBusinesses(transformedData);
      setError(null);
    } catch (err) {
      setError('Failed to load businesses. Please try again.');
      console.error('Error fetching businesses:', err);
    }
  };

  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = refetchSaveData && await refetchSaveData();
      if (response.Success) {
        //console.log(response);
        setShowSidebar(false);
        setShowAlertPopup(true);
        setAlertPopupType('success');
        setAlertPopupTitle('บันทึกข้อมูลสำเร็จ');
        setAlertPopupText('บันทึกข้อมูลสำเร็จ');
        // Reset form and close sidebar
        setNewBusiness({
          uid: '',
          supplier_name: '',
          sales_person: '',
          email: '',
          telephone: '',
          head_count: 0,
          type_id: 0,
          address: '',
          city: '', 
          remark: '',
          media_remark: '',
          MediaList: [],
          StatusList: [],
          type_name: '',
          contact_date: '',
          update_time: '',
          business_type: '',
          is_active: true,
        });
        refetchBusinesses();
      } else {
        setShowSidebar(false);
        setShowAlertPopup(true);
        setAlertPopupType('error');
        setAlertPopupTitle('บันทึกข้อมูลไม่สำเร็จ');
        setAlertPopupText('บันทึกข้อมูลไม่สำเร็จ: ' + response.Message);
      }
      
    } catch (error) {
      console.error('Error saving business:', error);
    }
  };

  const handleEditBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(editBusiness);
    //return;

    try {
      const response = refetchUpdateData && await refetchUpdateData();
      if (response.Success) {
        //console.log(response);
        setShowEditModal(false);
        setShowAlertPopup(true);
        setAlertPopupType('success');
        setAlertPopupTitle('อัปเดตข้อมูลสำเร็จ');
        setAlertPopupText('อัปเดตข้อมูลสำเร็จ');
        // Reset edit form
        setEditBusiness({
          uid: '',
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          employees: '',
          type_id: 0,
          address: '',
          city: '',
          remark: '',
          StatusList: [],
          createdAt: '',
          MediaList: [],
        });
        refetchBusinesses();
      } else {
        setShowEditModal(false);
        setShowAlertPopup(true);
        setAlertPopupType('error');
        setAlertPopupTitle('อัปเดตข้อมูลไม่สำเร็จ');
        setAlertPopupText(response.Message);
      }
    } catch (error) {
      setShowEditModal(false);
      setShowAlertPopup(true);
      setAlertPopupType('error');
      setAlertPopupTitle('อัปเดตข้อมูลไม่สำเร็จ');
      setAlertPopupText(error instanceof Error ? error.message : 'An error occurred while updating business');
    }
  };

  const filteredBusinesses = businesses.filter(business =>
    business.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalItems = filteredBusinesses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredBusinesses.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Export to CSV function
  const exportToCSV = (data: any[], filename: string, headers: { key: string; label: string }[]) => {
    // Build CSV header row
    const headerRow = headers.map(h => h.label).join(',');
    
    // Build data rows
    const dataRows = data.map(item => 
      headers.map(h => {
        let value = item[h.key];
        // Handle arrays (like StatusList, MediaList)
        if (Array.isArray(value)) {
          value = value.map((v: any) => v.name || v).join('; ');
        }
        // Escape quotes and wrap in quotes if contains comma or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    ).join('\n');
    
    // Create and download file with BOM for Thai characters
    const csv = `\uFEFF${headerRow}\n${dataRows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Handle export for businesses
  const handleExportBusinesses = () => {
    const headers = [
      { key: 'email', label: 'email' },
      { key: 'companyName', label: 'supplier_name' },
      { key: 'address', label: 'address' },
      { key: 'contactName', label: 'contact_person' },
      { key: 'phone', label: 'telephone' },
      { key: 'employees', label: 'head_count' },
      { key: 'remark', label: 'remark' },
    ];

    exportToCSV(filteredBusinesses, 'businesses', headers);
  };

  // Handle export for leads
  const handleExportLeads = () => {
    const filteredLeads = leadsData.filter(lead => 
      `${lead.Fname} ${lead.Lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Tel?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const dataToExport = filteredLeads.map(lead => ({
      fullName: `${lead.Fname} ${lead.Lname}`,
      email: lead.Email,
      tel: lead.Tel,
      interestedProject: lead.InterestedProjectName,
    }));

    const headers = [
      { key: 'fullName', label: 'ชื่อ-นามสกุล' },
      { key: 'email', label: 'อีเมล' },
      { key: 'tel', label: 'เบอร์โทร' },
      { key: 'interestedProject', label: 'โครงการที่สนใจ' },
    ];

    exportToCSV(dataToExport, 'leads', headers);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-[#123F6D]" />
              <h1 className="text-2xl font-bold text-[#123F6D]">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#123F6D] transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveView('businesses')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'businesses'
                    ? 'border-[#123F6D] text-[#123F6D]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>จัดการข้อมูลบริษัท</span>
                </div>
              </button>
              <button
                onClick={() => setActiveView('leads')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'leads'
                    ? 'border-[#123F6D] text-[#123F6D]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>ข้อมูลผู้สนใจ (Leads)</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#123F6D]">
              {activeView === 'businesses' ? 'ระบบจัดการข้อมูลบริษัท' : 'ข้อมูลผู้สนใจ (Leads)'}
            </h2>
          </div>
          {activeView === 'businesses' && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-[#F1683B] hover:bg-[#e5572f] text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>เพิ่ม</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowSidebar(true);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>เพิ่มรายการเดียว</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowCsvUploadDialog(true);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>อัพโหลด CSV</span>
                  </button>
                </div>
              </div>
            )}
            </div>
          )}
        </div>

        {/* Search Bar and Export Button */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
            />
          </div>
          <button
            onClick={activeView === 'businesses' ? handleExportBusinesses : handleExportLeads}
            className="bg-[#123F6D] hover:bg-[#0f2f54] text-white px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300"
          >
            <Download className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Content based on active view */}
        {activeView === 'businesses' ? (
          /* Business Table */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loadingData ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#123F6D] mx-auto"></div>
              <p className="text-gray-600 mt-4">กำลังโหลดข้อมูล...</p>
            </div>
          ) : error || errorData ? (
            <div className="p-8 text-center">
              <p className="text-red-600 mb-4">{error || errorData}</p>
              <button
                onClick={() => {
                  fetchBusinesses();
                  refetchBusinesses();
                }}
                className="bg-[#123F6D] hover:bg-[#0f2f54] text-white px-4 py-2 rounded-lg transition-colors"
              >
                ลองใหม่
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      อีเมล
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่อบริษัท
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ที่อยู่
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่อผู้ติดต่อ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      เบอร์โทรศัพท์
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จำนวนพนักงาน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      หมายเหตุ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        {searchTerm ? 'ไม่พบข้อมูลบริษัทที่ตรงกับค้นหา' : 'ไม่พบข้อมูลบริษัท'}
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((business) => (
                      <tr key={business.uid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{business.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building2 className="h-5 w-5 text-[#123F6D] mr-3" />
                            <div className="text-sm font-medium text-gray-900">
                              {business.companyName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{business.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{business.contactName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{business.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{business.employees}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{business.remark}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button onClick={() => {
                            setShowEditModal(true);
                            setEditBusiness(business);
                            console.log(business);
                          }} className="px-4 py-2 text-accent rounded-full hover:bg-gray-200 font-semibold transition-all duration-300">
                            <SquarePen className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {!loadingData && !error && !errorData && totalItems > 0 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              {/* Items per page and info */}
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
                  <span className="text-sm text-gray-700">รายการต่อหน้า</span>
                </div>
                <div className="text-sm text-gray-700">
                  แสดง {startIndex + 1} ถึง {Math.min(endIndex, totalItems)} จาก {totalItems} รายการ
                  {searchTerm && ` (กรองจากการค้นหา "${searchTerm}")`}
                </div>
              </div>
              
              {/* Pagination controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum;
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        ) : (
          /* Leads Table */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loadingLeads ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#123F6D] mx-auto"></div>
                <p className="text-gray-600 mt-4">กำลังโหลดข้อมูล Leads...</p>
              </div>
            ) : errorLeads ? (
              <div className="p-8 text-center">
                <p className="text-red-600 mb-4">{errorLeads}</p>
                <button
                  onClick={refetchLeads}
                  className="bg-[#123F6D] hover:bg-[#0f2f54] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  ลองใหม่
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ชื่อ-นามสกุล
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        อีเมล
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        เบอร์โทร
                      </th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        บริษัท
                      </th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        โครงการที่สนใจ
                      </th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        แหล่งที่มา
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leadsData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          ไม่มีข้อมูล Leads
                        </td>
                      </tr>
                    ) : (
                      leadsData.map((lead) => (
                        <tr key={lead.uid} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Users className="h-5 w-5 text-[#123F6D] mr-3" />
                              <div className="text-sm font-medium text-gray-900">
                                {lead.Fname} {lead.Lname}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lead.Email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lead.Tel}</div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{getCompanyName(lead.CompanyID)}</div>
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lead.InterestedProjectName}</div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {Array.isArray(lead.Source) ? lead.Source.join(', ') : lead.Source}
                            </div>
                          </td> */}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Business Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSidebar(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#123F6D]">เพิ่มข้อมูลใหม่</h3>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddBusiness} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อบริษัท <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newBusiness?.supplier_name}
                  onChange={(e) => setNewBusiness({...newBusiness, supplier_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  placeholder="ระบุชื่อบริษัท"
                />
              </div>

              <div className='flex gap-6'>
              
                <div className='w-full md:w-1/2'>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ชื่อผู้ติดต่อ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newBusiness?.sales_person}
                    onChange={(e) => setNewBusiness({...newBusiness, sales_person: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="ระบุชื่อผู้ติดต่อ"
                  />
                </div>
                
                <div className='w-full md:w-1/2'>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    อีเมล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newBusiness?.email}
                    onChange={(e) => setNewBusiness({...newBusiness, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="contact@company.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  value={newBusiness?.telephone}
                  onChange={(e) => setNewBusiness({...newBusiness, telephone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  placeholder="081-234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ที่อยู่
                </label>
                <input
                  type="text"
                  value={newBusiness?.address}
                  onChange={(e) => setNewBusiness({...newBusiness, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  placeholder="ระบุที่อยู่"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  จังหวัด
                </label>
                <input
                  type="text"
                  value={newBusiness?.city}
                  onChange={(e) => setNewBusiness({...newBusiness, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  placeholder="ระบุจังหวัด"
                />
              </div>
              
              <div className='flex gap-6'>
                <div className='w-full md:w-1/2'>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    จำนวนพนักงาน (Head Office) <span className="text-red-500">*</span>  
                  </label>
                  <input
                    type="number"
                    value={newBusiness?.head_count}
                    onChange={(e) => setNewBusiness({...newBusiness, head_count: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="ระบุจำนวนพนักงาน"
                    min="0"
                  />
                </div>             
                <div className='w-full md:w-1/2'>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ประเภท <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={supplierTypeList.find(type => type.id === newBusiness?.type_id) ? {
                      value: newBusiness?.type_id,
                      label: supplierTypeList.find(type => type.id === newBusiness?.type_id)?.name
                    } : null}
                    onChange={(selected) => setNewBusiness({...newBusiness, type_id: selected?.value || 0})}
                    options={supplierTypeList.map(type => ({
                      value: type.id,
                      label: type.name
                    }))}
                    className="w-full"
                    classNamePrefix="react-select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: '50px',
                        borderRadius: '8px',
                        minHeight: '50px'
                      })
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ช่องทางการรับข้อมูล
                </label>
                <Select
                  isMulti
                  value={supplierMediaTypeList
                    .filter(type => newBusiness?.MediaList?.some(m => m.id === type.id))
                    .map(type => ({ value: type.id, label: type.name }))
                  }
                  onChange={(selectedOptions) => {
                    setNewBusiness({
                      ...newBusiness,
                      MediaList: selectedOptions.map(option => ({ 
                        id: option.value,
                        name: option.label 
                      }))
                    });
                  }}
                  options={supplierMediaTypeList.map(type => ({
                    value: type.id,
                    label: type.name
                  }))}
                  className="w-full"
                  classNamePrefix="react-select"
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#123F6D',
                      primary25: '#e6edf5'
                    }
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  หมายเหตุ
                </label>
                <input
                  type="text"
                  value={newBusiness?.remark}
                  onChange={(e) => setNewBusiness({...newBusiness, remark: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  placeholder="ระบุหมายเหตุ"
                />
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSidebar(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#F1683B] hover:bg-[#e5572f] text-white rounded-lg font-semibold transition-all duration-300"
                >
                  เพิ่มข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Business Modal */}
      {showEditModal && editBusiness && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowEditModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#123F6D]">แก้ไขข้อมูล</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditBusinessSubmit(e);
              setShowEditModal(false);
            }} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อบริษัท <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editBusiness.companyName}
                  onChange={(e) => setEditBusiness({...editBusiness, companyName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  placeholder="ระบุชื่อบริษัท"
                />
              </div>

              <div className='flex gap-6'>
                <div className='w-full md:w-1/2'>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ชื่อผู้ติดต่อ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editBusiness.contactName}
                    onChange={(e) => setEditBusiness({...editBusiness, contactName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="ระบุชื่อผู้ติดต่อ"
                  />
                </div>
                
                <div className='w-full md:w-1/2'>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    อีเมล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={editBusiness.email}
                    onChange={(e) => setEditBusiness({...editBusiness, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="ระบุอีเมล"
                  />
                </div>
              </div>

              <div className='flex gap-6'>
                <div className='w-full md:w-1/2'>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={editBusiness.phone}
                    onChange={(e) => setEditBusiness({...editBusiness, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="ระบุเบอร์โทรศัพท์"
                  />
                </div>

                <div className='w-full md:w-1/2'>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    จำนวนพนักงาน <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={editBusiness.employees}
                    onChange={(e) => setEditBusiness({...editBusiness, employees: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="ระบุจำนวนพนักงาน"
                  />
                </div>
              </div>

              <div className='w-full'>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ที่อยู่
                </label>
                <input
                  type="text"
                  value={editBusiness.address}
                  onChange={(e) => setEditBusiness({...editBusiness, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  placeholder="ระบุที่อยู่"
                />
              </div>

              <div className='flex gap-6'>
                <div className='w-full md:w-1/2'>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    จังหวัด
                  </label>
                  <input
                    type="text"
                    value={editBusiness.city}
                    onChange={(e) => setEditBusiness({...editBusiness, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="ระบุจังหวัด"
                  />
                </div>

                <div className='w-full md:w-1/2'>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ประเภท <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={supplierTypeList.find(type => type.id === editBusiness.type_id) ? {
                      value: editBusiness.type_id,
                      label: supplierTypeList.find(type => type.id === editBusiness.type_id)?.name
                    } : null}
                    onChange={(selected) => setEditBusiness({...editBusiness, type_id: selected?.value || 0})}
                    options={supplierTypeList.map(type => ({
                      value: type.id,
                      label: type.name
                    }))}
                    className="w-full"
                    classNamePrefix="react-select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: '50px',
                        borderRadius: '8px',
                        minHeight: '50px'
                      })
                    }}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: '#123F6D',
                        primary25: '#e6edf5'
                      }
                    })}
                  />
                </div>
              </div>

              <div className='flex gap-6'>
                <div className='w-full md:w-1/2'>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    สถานะ
                  </label>
                  <Select
                    value={editBusiness.StatusList.length > 0 ? {
                      value: editBusiness.StatusList[0].id,
                      label: editBusiness.StatusList[0].name
                    } : null}
                    onChange={(selected) => setEditBusiness({...editBusiness, StatusList: selected ? [{
                      id: selected.value,
                      code: '',
                      name: selected.label
                    }] : []})}
                    options={supplierStatusList.map(status => ({
                      value: status.id,
                      label: status.name
                    }))}
                    className="w-full"
                    classNamePrefix="react-select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: '50px',
                        borderRadius: '8px',
                        minHeight: '50px'
                      })
                    }}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: '#123F6D',
                        primary25: '#e6edf5'
                      }
                    })}
                  />
                </div>
                <div className='w-full md:w-1/2'>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ช่องทางการรับข้อมูล
                  </label>
                  <Select
                    isMulti
                    value={supplierMediaTypeList
                      .filter(type => editBusiness.MediaList?.some(m => m.id === type.id))
                      .map(type => ({ value: type.id, label: type.name }))
                    }
                    onChange={(selectedOptions) => {
                      setEditBusiness({
                        ...editBusiness,
                        MediaList: selectedOptions.map(option => ({ id: option.value, name: option.label }))
                      });
                    }}
                    options={supplierMediaTypeList.map(type => ({
                      value: type.id,
                      label: type.name
                    }))}
                    className="w-full"
                    classNamePrefix="react-select"
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: '#123F6D',
                        primary25: '#e6edf5'
                      }
                    })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  หมายเหตุ
                </label>
                <input
                  type="text"
                  value={editBusiness.remark}
                  onChange={(e) => setEditBusiness({...editBusiness, remark: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  placeholder="ระบุหมายเหตุ"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button type="submit" className="px-6 py-3 bg-[#F1683B] hover:bg-[#e5572f] text-white rounded-lg font-semibold transition-all duration-300">
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCsvUploadDialog && (
        <CsvUploadDialog
          onClose={() => setShowCsvUploadDialog(false)}
        />
      )}

      {showAlertPopup && (
        <AlertPopup
          popup_type={alertPopupType}
          popup_title={alertPopupTitle}
          popup_text={alertPopupText}
          onCancel={() => setShowAlertPopup(false)}
          onConfirm={() => setShowAlertPopup(false)}
        />
      )}

    </div>
  );
}