import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Building2, X, Search, SquarePen } from 'lucide-react';
import { authService } from '../utils/auth';
import { Supplier } from '../utils/types';
import { useGetData, useGetSupplierMediaTypeList, useGetSupplierTypeList } from '../hooks/getData';
import Select from 'react-select';
import { useSaveData } from '../hooks/saveData';
import AlertPopup from './AlertPopup';

interface Business {
  uid: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  employees: string;
  type_id: number;
  StatusList?: string;
  createdAt?: string;
  address?: string;
  city?: string;
  remark?: string;
  MediaList?: { id: number }[];
}

interface DataResponse {
  Data: Supplier[];
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
  const [editBusiness, setEditBusiness] = useState<Business | null>(null);
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const [alertPopupType, setAlertPopupType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [alertPopupTitle, setAlertPopupTitle] = useState('');
  const [alertPopupText, setAlertPopupText] = useState('');

  const { data: bussinessData, loading: loadingData, error: errorData, refetch } = useGetData();
  const { data: supplierTypeList, loading: loadingSupplierTypeList, error: errorSupplierTypeList, refetch: refetchSupplierTypeList } = useGetSupplierTypeList();
  const { data: supplierMediaTypeList, loading: loadingSupplierMediaTypeList, error: errorSupplierMediaTypeList, refetch: refetchSupplierMediaTypeList } = useGetSupplierMediaTypeList();
  const saveDataResult = useSaveData(newBusiness);
  const { data: saveData = [], loading: loadingSaveData = false, error: errorSaveData = null, refetch: refetchSaveData } = saveDataResult || {};


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
      setLoading(true);
      // console.log(bussinessData);

      // Transform API data to match our interface
      const transformedData = Array.isArray(bussinessData) ? bussinessData.map((item: Supplier, index: number) => ({
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
        status: item.StatusList[0]?.name || 'Active',
        createdAt: item.contact_date || new Date().toISOString(),
        MediaList: item.MediaList || []
      })) : [];
      
      setBusinesses(transformedData);
      setError(null);
    } catch (err) {
      setError('Failed to load businesses. Please try again.');
      console.error('Error fetching businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = refetchSaveData && await refetchSaveData();
      if (response.Success) {
        console.log(response);
        setShowSidebar(false);
        setShowAlertPopup(true);
        setAlertPopupType('success');
        setAlertPopupTitle('บันทึกข้อมูลสำเร็จ');
        setAlertPopupText('บันทึกข้อมูลสำเร็จ');
      } else {
        setShowSidebar(false);
        setShowAlertPopup(true);
        setAlertPopupType('error');
        setAlertPopupTitle('บันทึกข้อมูลไม่สำเร็จ');
        setAlertPopupText('บันทึกข้อมูลไม่สำเร็จ');
      }
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
    } catch (error) {
      console.error('Error saving business:', error);
    }
  };

  const handleEditBusiness = (business: Business) => {
    console.log(business);
    setEditBusiness(business);
    setShowEditModal(true);
  };

  const filteredBusinesses = businesses.filter(business =>
    business.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#123F6D]">ระบบจัดการข้อมูลบริษัท</h2>
          </div>
          <button
            onClick={() => setShowSidebar(true)}
            className="bg-[#F1683B] hover:bg-[#e5572f] text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>เพิ่ม</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
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
        </div>

        {/* Business Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#123F6D] mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading businesses...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchBusinesses}
                className="bg-[#123F6D] hover:bg-[#0f2f54] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่อบริษัท
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่อผู้ติดต่อ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      อีเมล
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      เบอร์โทรศัพท์
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จำนวนพนักงาน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ประเภท
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBusinesses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        {searchTerm ? 'ไม่พบข้อมูลบริษัทที่ตรงกับค้นหา' : 'ไม่พบข้อมูลบริษัท'}
                      </td>
                    </tr>
                  ) : (
                    filteredBusinesses.map((business) => (
                      <tr key={business.uid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building2 className="h-5 w-5 text-[#123F6D] mr-3" />
                            <div className="text-sm font-medium text-gray-900">
                              {business.companyName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{business.contactName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{business.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{business.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{business.employees}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{supplierTypeList.find(type => type.id === business.type_id)?.name || business.type_id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            business.StatusList === 'Active' 
                              ? 'bg-green-100 text-green-800'
                              : business.StatusList === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {business.StatusList || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button onClick={() => handleEditBusiness(business)} className="px-4 py-2 text-accent rounded-full hover:bg-gray-200 font-semibold transition-all duration-300">
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
        </div>
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
                  ชื่อบริษัท *
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
                    ชื่อผู้ติดต่อ *
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
                    อีเมล *
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
                    จำนวนพนักงาน (Head Office)
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
                    ประเภท
                  </label>
                  <select
                    value={newBusiness?.type_id}
                    onChange={(e) => setNewBusiness({...newBusiness, type_id: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  >
                    <option value={0}>เลือกประเภทธุรกิจ</option>
                    {supplierTypeList.map((type: any) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
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
              // Handle edit submission here
              console.log(editBusiness);
              setShowEditModal(false);
            }} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อบริษัท *
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
                    ชื่อผู้ติดต่อ *
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
                    อีเมล *
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
                    เบอร์โทรศัพท์ *
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
                    จำนวนพนักงาน *
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

              <div className='w-full md:w-1/2'>
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ประเภทธุรกิจ *
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
                      MediaList: selectedOptions.map(option => ({ id: option.value }))
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
                <button
                  type="submit"
                  disabled
                  className="px-6 py-3 bg-[#F1683B] hover:bg-[#e5572f] text-white rounded-lg font-semibold transition-all duration-300 opacity-50 cursor-not-allowed"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
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