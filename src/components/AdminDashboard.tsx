import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Building2, X, Search, Clock } from 'lucide-react';
import { authService } from '../utils/auth';
import { Supplier } from '../utils/types';
import { useGetData, useGetSupplierMediaTypeList, useGetSupplierTypeList } from '../hooks/getData';

interface Business {
  id: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [newBusiness, setNewBusiness] = useState<Business>({
    id: '',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    employees: '',
    type_id: 0,
    address: '',
    city: '',
    remark: '',
    MediaList: [],
    StatusList: 'Pending',
  });

  const { data: bussinessData, loading: loadingData, error: errorData, refetch } = useGetData();
  const { data: supplierTypeList, loading: loadingSupplierTypeList, error: errorSupplierTypeList, refetch: refetchSupplierTypeList } = useGetSupplierTypeList();
  const { data: supplierMediaTypeList, loading: loadingSupplierMediaTypeList, error: errorSupplierMediaTypeList, refetch: refetchSupplierMediaTypeList } = useGetSupplierMediaTypeList();

  useEffect(() => {
    fetchBusinesses();
  }, [bussinessData]);

  // Session timer effect
  useEffect(() => {
    const updateSessionTime = () => {
      const remainingTime = authService.getRemainingTime();
      setSessionTime(remainingTime);
      
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
        id: item.uid || `business-${index}`,
        companyName: item.supplier_name || 'N/A',
        contactName: item.sales_person || 'N/A',
        email: item.email || 'N/A',
        phone: item.telephone || 'N/A',
        employees: item.head_count.toString() || 'N/A',
        type_id: item.type_id || 0,
        status: item.StatusList[0]?.name || 'Active',
        createdAt: item.contact_date || new Date().toISOString()
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

  const handleAddBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new business object
    const business: Business = {
      ...newBusiness,
      StatusList: 'Pending',
      createdAt: new Date().toISOString()
    };

    console.log(business);
    return;
    
    // Add to local state (in real app, this would be an API call)
    setBusinesses([business, ...businesses]);
    
          // Reset form and close sidebar
      setNewBusiness({
        id: '',
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        employees: '',
        type_id: 0,
        address: '',
        city: '',
        remark: '',
        MediaList: [],
        StatusList: 'Pending',
      });
    setShowSidebar(false);
    
    // Show success message
    alert('Business added successfully!');
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
              {/* Session Timer */}
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {sessionTime > 0 ? `${sessionTime}m left` : 'Expired'}
                </span>
                {sessionTime > 0 && sessionTime < 10 && (
                  <button
                    onClick={() => {
                      if (authService.extendSession()) {
                        setSessionTime(240);
                        alert('Session extended by 4 hours');
                      }
                    }}
                    className="ml-2 text-xs bg-[#F1683B] hover:bg-[#e5572f] text-white px-2 py-1 rounded"
                  >
                    Extend
                  </button>
                )}
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#123F6D] transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
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
            <h2 className="text-3xl font-bold text-[#123F6D]">Business Partners</h2>
            <p className="text-gray-600 mt-2">Manage your B2B business partnerships</p>
          </div>
          <button
            onClick={() => setShowSidebar(true)}
            className="bg-[#F1683B] hover:bg-[#e5572f] text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>Add New</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search businesses..."
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
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Industry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBusinesses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        {searchTerm ? 'No businesses found matching your search.' : 'No businesses found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredBusinesses.map((business) => (
                      <tr key={business.id} className="hover:bg-gray-50">
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
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSidebar(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#123F6D]">เพิ่มข้อมูลใหม่</h3>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddBusiness} className="p-6 space-y-6 overflow-y-auto h-full pb-20">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อบริษัท *
                </label>
                <input
                  type="text"
                  required
                  value={newBusiness.companyName}
                  onChange={(e) => setNewBusiness({...newBusiness, companyName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  placeholder="ระบุชื่อบริษัท"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อผู้ติดต่อ *
                </label>
                <input
                  type="text"
                  required
                  value={newBusiness.contactName}
                  onChange={(e) => setNewBusiness({...newBusiness, contactName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  placeholder="ระบุชื่อผู้ติดต่อ"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  อีเมล *
                </label>
                <input
                  type="email"
                  required
                  value={newBusiness.email}
                  onChange={(e) => setNewBusiness({...newBusiness, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  placeholder="contact@company.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  value={newBusiness.phone}
                  onChange={(e) => setNewBusiness({...newBusiness, phone: e.target.value})}
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
                  value={newBusiness.address}
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
                  value={newBusiness.city}
                  onChange={(e) => setNewBusiness({...newBusiness, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  placeholder="ระบุจังหวัด"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  จำนวนพนักงาน (Head Office)
                </label>
                <input
                  type="number"
                  value={newBusiness.employees}
                  onChange={(e) => setNewBusiness({...newBusiness, employees: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  placeholder="ระบุจำนวนพนักงาน"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ประเภท
                </label>
                <select
                  value={newBusiness.type_id}
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ช่องทางการรับข้อมูล
                </label>
                <select
                  multiple
                  value={newBusiness.MediaList?.map(m => m.id.toString()) || []}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    setNewBusiness({
                      ...newBusiness, 
                      MediaList: selectedOptions.map((id: string) => ({ id: parseInt(id) }))
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  size={4}
                >
                  {supplierMediaTypeList.map((type: any) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">กด Ctrl หรือ Command เพื่อเลือกหลายตัวเลือก</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  หมายเหตุ
                </label>
                <input
                  type="text"
                  value={newBusiness.remark}
                  onChange={(e) => setNewBusiness({...newBusiness, remark: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  placeholder="ระบุหมายเหตุ"
                />
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#F1683B] hover:bg-[#e5572f] text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                >
                  เพิ่มข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}