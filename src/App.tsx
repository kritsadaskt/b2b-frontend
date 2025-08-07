import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Search, Building2, Users, CheckCircle, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { authService } from './utils/auth';
import { useGetData } from './hooks/getData';
import { Supplier } from './utils/types';
import Footer from './components/Footer';
import RegisterLeadForm from './components/RegisterLeadForm';
import HeroBanner from './components/HeroBanner';
import Info from './components/Info';
import Header from './components/Header';

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
    industry: ''
  });
  const { data: availableCompanies, loading, error } = useGetData(searchQuery);

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
          selectCompany(filteredCompanies[selectedIndex].supplier_name);
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

  const selectCompany = (companyName: string) => {
    setSearchQuery(companyName);
    setShowDropdown(false);
    setSelectedIndex(-1);
    // Automatically trigger search when company is selected
    const isAvailable = availableCompanies.some((company: Supplier) => 
      company.supplier_name.toLowerCase() === companyName.toLowerCase()
    );
    setSearchResult(isAvailable ? 'available' : 'not-available');
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
    alert('Thank you for your submission! We will contact you within 24 hours.');
    setBusinessForm({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      employees: '',
      industry: ''
    });
  };

  const services = [
    {
      title: 'Financial Planning',
      description: 'Comprehensive financial advisory services for your employees',
      discount: '5-8%'
    },
    {
      title: 'Investment Management',
      description: 'Professional portfolio management with reduced fees',
      discount: '10%'
    },
    {
      title: 'Insurance Services',
      description: 'Group insurance plans with corporate discounts',
      discount: '7-12%'
    },
    {
      title: 'Tax Consultation',
      description: 'Expert tax advice and preparation services',
      discount: '5-10%'
    },
    {
      title: 'Estate Planning',
      description: 'Comprehensive estate planning and legal services',
      discount: '8-15%'
    },
    {
      title: 'Retirement Planning',
      description: '401k optimization and retirement strategy consulting',
      discount: '5-12%'
    }
  ];

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
                           selectCompany(company.supplier_name);
                           console.log(company.supplier_name);
                         }}
                         onClick={() => {
                           selectCompany(company.supplier_name);
                           console.log(company.supplier_name);
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
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-6 md:p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-green-800 mb-2">พบข้อมูล</h4>
                  <h5 className="text-green-700 text-xl mb-4">บริษัท <strong>{searchQuery}</strong></h5>
                  <p className="text-green-700">กรุณากรอกข้อมูลด้านล่างเพื่อยืนยันรับสิทธิ์</p>
                  <hr className="my-7 border-green-500 w-1/3 mx-auto border-2" />
                  <RegisterLeadForm />
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

      {/* Services Section */}
      <section id="services" className="py-20 hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-[#123F6D] mb-4">
              Exclusive Employee Benefits
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive financial services with special discounts for employees of our partner companies. 
              Active employees can save 5-15% on professional financial advisory services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-[#123F6D]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-[#123F6D]">{service.title}</h4>
                  <span className="bg-[#F1683B] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {service.discount} OFF
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center text-[#123F6D] font-semibold">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">For verified employees only</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#123F6D] rounded-2xl p-8 text-white text-center">
            <h4 className="text-2xl font-bold mb-4">How It Works</h4>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-[#F1683B] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h5 className="font-semibold mb-2">Verify Employment</h5>
                <p className="text-blue-100">Show proof of employment at a partner company</p>
              </div>
              <div className="text-center">
                <div className="bg-[#F1683B] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h5 className="font-semibold mb-2">Choose Services</h5>
                <p className="text-blue-100">Select from our comprehensive financial services</p>
              </div>
              <div className="text-center">
                <div className="bg-[#F1683B] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h5 className="font-semibold mb-2">Get Discounts</h5>
                <p className="text-blue-100">Enjoy 5-15% savings on all selected services</p>
              </div>
            </div>
          </div>
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
              Submit your business information to discuss partnership opportunities and employee benefits
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

              <button
                type="submit"
                className="w-full bg-[#F1683B] hover:bg-[#e5572f] text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                ส่งข้อมูล
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
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
              isAuthenticated ? (
                <AdminDashboard onLogout={handleLogout} />
              ) : (
                <AdminLogin onLogin={handleLogin} error={loginError} />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;