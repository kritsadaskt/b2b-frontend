import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Search, Building2, CheckCircle, ArrowRight } from 'lucide-react';

// Lazy load admin components for code splitting
const AdminLogin = React.lazy(() => import('./components/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const SubmitLeadForm = React.lazy(() => import('./components/SubmitLeadForm'));
import { authService } from './utils/auth';
import { useGetData } from './hooks/getData';
import { Supplier } from './utils/types';
import Footer from './components/Footer';
//import RegisterLeadForm from './components/RegisterLeadForm';
import HeroBanner from './components/HeroBanner';
import Info from './components/Info';
import Header from './components/Header';
import AlertPopup from './components/AlertPopup';
import HowToApply from './components/HowToApply';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [businessForm, setBusinessForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    employees: '',
    industry: '',
    timestamp: new Date().toLocaleString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  });
  const { data: availableCompanies } = useGetData(searchQuery);
  const [isSending, setIsSending] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Filter companies based on search query
  const filteredCompanies = availableCompanies.filter((company: Supplier) =>
    company.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10); // Limit to 10 suggestions

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(value.length > 0);
    setSelectedIndex(-1);
    setSearchResult(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filteredCompanies.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCompanies.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectCompany(filteredCompanies[selectedIndex].supplier_name, filteredCompanies[selectedIndex].uid);
        } else {
          handleSearch(e as any);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectCompany = (companyName: string, companyUid: string) => {
    setSearchQuery(companyName);
    setShowDropdown(false);
    setSelectedIndex(-1);
    // Automatically trigger search when company is selected
    const isAvailable = availableCompanies.some((company: Supplier) => 
      company.supplier_name.toLowerCase() === companyName.toLowerCase()
    );
    setSearchResult(isAvailable ? 'available' : 'not-available');
    if (sessionStorage.getItem('selectedCompany')) {
      sessionStorage.removeItem('selectedCompany');
    }
    sessionStorage.setItem('selectedCompany', JSON.stringify({ companyName: companyName, companyUid: companyUid }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    if (searchQuery.trim()) {
      // Simulate search result
      const isAvailable = availableCompanies.some((company: Supplier) => 
        company.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      //console.log(availableCompanies);
      
      setSearchResult(isAvailable ? 'available' : 'not-available');
    }
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if terms are accepted
    if (!termsAccepted) {
      setAlertType('error');
      setAlertTitle('กรุณายอมรับข้อกำหนด');
      setAlertMessage('กรุณายอมรับข้อกำหนดและเงื่อนไขก่อนส่งข้อมูล');
      setShowAlert(true);
      return;
    }
    
    setIsSending(true);
    setBusinessForm({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      employees: '',
      industry: '',
      timestamp: new Date().toISOString(),
    });
    // Send form data to API endpoint
    fetch('https://node.assetwise.dev/webhook/send-b2b-mail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(businessForm)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Show success modal
      setAlertType('success');
      setAlertTitle('ส่งข้อมูลสำเร็จ');
      setAlertMessage('เราจะติดต่อกลับภายใน 24 ชั่วโมง');
      setShowAlert(true);
      
      // Reset form
      setBusinessForm({
        companyName: '',
        contactName: '', 
        email: '',
        phone: '',
        employees: '',
        industry: '',
        timestamp: new Date().toISOString()
      });
      setIsSending(false);
    })
    .catch(error => {
      // Show error modal
      setAlertType('error');
      setAlertTitle('เกิดข้อผิดพลาด');
      setAlertMessage('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
      setShowAlert(true);
      console.error('Error:', error);
    });
  };
  
  return (
    <>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroBanner />

      {/* Info Section */}
      <Info />

      {/* Search Section */}
      <section id="search" className="pt-10 pb-5 lg:py-10 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[#123F6D] mb-4">
              ตรวจสอบสิทธิ์
            </h3>
            <p className="text-lg text-gray-600">
              กรอกชื่อบริษัทเพื่อตรวจสอบสิทธิ์ของคุณ
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="กรอกชื่อบริษัท..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent text-lg"
                />
                                 {showDropdown && filteredCompanies.length > 0 && (
                   <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                     {filteredCompanies.map((company, index) => (
                       <li
                         key={company.uid}
                         className={`p-3 cursor-pointer hover:bg-gray-100 ${
                           index === selectedIndex ? 'bg-gray-100 font-semibold' : ''
                         }`}
                         onMouseDown={(e) => {
                           e.preventDefault(); // Prevent blur from firing
                           selectCompany(company.supplier_name, company.uid);
                          //  console.log(company.supplier_name);
                          //  console.log(company.uid);
                         }}
                         onClick={() => {
                           selectCompany(company.supplier_name, company.uid);
                          //  console.log(company.supplier_name);
                          //  console.log(company.uid);
                         }}
                       >
                         {company.supplier_name}
                       </li>
                     ))}
                   </ul>
                 )}
              </div>
              <button
                type="submit"
                className="bg-[#123F6D] hover:bg-[#0f2f54] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>ตรวจสอบสิทธิ์</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>

          {searchResult && (
            <div className="max-w-2xl mx-auto">
              {searchResult === 'available' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 pt-4 pb-6 md:px-6 md:py-10 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-green-800 mb-2">พบข้อมูล</h4>
                  <h5 className="text-green-700 text-xl mb-4">บริษัท <strong>{searchQuery}</strong></h5>
                  <div className="flex justify-center">
                    <Link to="/submit" className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-lg font-semibold shadow-lg">กรอกข้อมูลเพื่อรับสิทธิ์</Link>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                  <Building2 className="h-12 w-12 text-[#F1683B] mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-orange-800 mb-2">ยังไม่พบข้อมูล</h4>
                  <p className="text-orange-700 mb-4">
                    ยังไม่พบข้อมูลบริษัท <strong>{searchQuery}</strong> หากสนใจสมัครเป็นพาร์ทเนอร์กับ AssetWise กรุณากรอกข้อมูลด้านล่าง
                  </p>
                  <a href="#partner" className="inline-flex items-center space-x-2 bg-[#F1683B] hover:bg-[#e5572f] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    <span>สมัครเป็นพาร์ทเนอร์</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Business Submission Form */}
      <section id="partner" className="py-10 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[#123F6D] mb-4">
              สมัครเป็นพาร์ทเนอร์กับ AssetWise
            </h3>
            <p className="text-lg text-gray-600">
              กรอกข้อมูลบริษัทเพื่อสมัครเป็นพาร์ทเนอร์กับ AssetWise
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleBusinessSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ชื่อบริษัท *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessForm.companyName}
                    onChange={(e) => setBusinessForm({...businessForm, companyName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="กรอกชื่อบริษัท"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ชื่อผู้ติดต่อ *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessForm.contactName}
                    onChange={(e) => setBusinessForm({...businessForm, contactName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="กรอกชื่อผู้ติดต่อ"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    อีเมล *
                  </label>
                  <input
                    type="email"
                    required
                    value={businessForm.email}
                    onChange={(e) => setBusinessForm({...businessForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="กรอกอีเมล"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    หมายเลขโทรศัพท์
                  </label>
                  <input
                    type="tel"
                    value={businessForm.phone}
                    onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="กรอกหมายเลขโทรศัพท์"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    จำนวนพนักงาน
                  </label>
                  <select
                    value={businessForm.employees}
                    onChange={(e) => setBusinessForm({...businessForm, employees: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  >
                    <option value="">เลือกช่วง</option>
                    <option value="1-10">1-10 คน</option>
                    <option value="11-50">11-50 คน</option>
                    <option value="51-200">51-200 คน</option>
                    <option value="201-1000">201-1000 คน</option>
                    <option value="1000+">1000+ คน</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    กลุ่มธุรกิจ
                  </label>
                  <input
                    type="text"
                    value={businessForm.industry}
                    onChange={(e) => setBusinessForm({...businessForm, industry: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="เช่น ประกันชีวิต, ธนาคาร ฯลฯ"
                  />
                </div>
              </div>

              <div className="flex items-start my-4">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) =>
                    setTermsAccepted(e.target.checked)
                  }
                  className="mt-1 accent-[#F1683B]"
                  style={{ width: 18, height: 18 }}
                />
                <label
                  htmlFor="terms"
                  className="ml-2 text-sm text-gray-700 select-none cursor-pointer"
                >
                  ข้าพเจ้ายินยอมให้ AssetWise เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าตามวัตถุประสงค์ที่ระบุไว้ใน<a href="https://assetwise.co.th/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline text-[#123F6D] hover:text-[#F1683B] transition">นโยบายความเป็นส่วนตัว</a> และ<a href="https://assetwise.co.th/terms-and-conditions/assetwise-partners/" target="_blank" rel="noopener noreferrer" className="underline text-[#123F6D] hover:text-[#F1683B] transition">ข้อกำหนดและเงื่อนไข</a> <span className="text-red-500">*</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#F1683B] hover:bg-[#e5572f] text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSending}
              >
                {isSending ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูล'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* How to Apply Section */}
      <HowToApply />

      {/* Footer */}
      <Footer />

      {/* Alert Popup */}
      {showAlert && (
        <AlertPopup
          popup_type={alertType}
          popup_title={alertTitle}
          popup_text={alertMessage}
          onCancel={() => setShowAlert(false)}
          onConfirm={() => setShowAlert(false)}
        />
      )}
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const existingSession = authService.isAuthenticated();
    setIsAuthenticated(existingSession);
    setIsLoading(false);

    // Optional: Show remaining time in console for debugging
    if (existingSession) {
      // const remainingTime = authService.getRemainingTime();
      console.log(`Session restored.`);
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    // Simple authentication - in production, this should be secure
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError(undefined);
      
      // Store the session in localStorage
      authService.setSession(true);
      
      console.log('Login successful.');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginError(undefined);
    
    // Clear the stored session
    authService.clearSession();
    
    console.log('Logged out successfully.');
  };

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#123F6D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/admin" 
            element={
              <Suspense fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#123F6D] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                  </div>
                </div>
              }>
                {isAuthenticated ? (
                  <AdminDashboard onLogout={handleLogout} />
                ) : (
                  <AdminLogin onLogin={handleLogin} error={loginError} />
                )}
              </Suspense>
            } 
          />
          <Route path="/submit" element={<SubmitLeadForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;