import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Search, Building2, Users, CheckCircle, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [businessForm, setBusinessForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    employees: '',
    industry: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Simulate search result
      const availableCompanies = ['Microsoft', 'Google', 'Apple', 'Amazon', 'Meta', 'Tesla', 'Netflix'];
      const isAvailable = availableCompanies.some(company => 
        company.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-[#123F6D]" />
              <h1 className="text-2xl font-bold text-[#123F6D]">Assetwise B2B Service</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#search" className="text-gray-600 hover:text-[#123F6D] transition-colors">Search</a>
              <a href="#services" className="text-gray-600 hover:text-[#123F6D] transition-colors">Services</a>
              <a href="#partner" className="text-gray-600 hover:text-[#123F6D] transition-colors">Become Partner</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#123F6D] to-[#1a5591] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Premium Financial Services
            <span className="block text-[#F1683B]">For Your Business</span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Exclusive discounts and tailored financial solutions for employees of partner companies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#search" className="bg-[#F1683B] hover:bg-[#e5572f] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Check Availability
            </a>
            <a href="#partner" className="bg-transparent border-2 border-white hover:bg-white hover:text-[#123F6D] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300">
              Partner With Us
            </a>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[#123F6D] mb-4">
              Check Service Availability
            </h3>
            <p className="text-lg text-gray-600">
              Enter your company name to see if we offer services to your employees
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Enter company or business name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent text-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-[#123F6D] hover:bg-[#0f2f54] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Search</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>

          {searchResult && (
            <div className="max-w-2xl mx-auto">
              {searchResult === 'available' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-green-800 mb-2">Great News!</h4>
                  <p className="text-green-700">
                    We offer services to employees of <strong>{searchQuery}</strong>. 
                    Your employees are eligible for exclusive discounts on our financial services.
                  </p>
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                  <Building2 className="h-12 w-12 text-[#F1683B] mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-orange-800 mb-2">Not Yet Available</h4>
                  <p className="text-orange-700 mb-4">
                    We don't currently offer services to <strong>{searchQuery}</strong>, but we'd love to discuss a partnership.
                  </p>
                  <a href="#partner" className="inline-flex items-center space-x-2 bg-[#F1683B] hover:bg-[#e5572f] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    <span>Submit Your Business</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
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
      <section id="partner" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[#123F6D] mb-4">
              Become a Partner
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
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessForm.companyName}
                    onChange={(e) => setBusinessForm({...businessForm, companyName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessForm.contactName}
                    onChange={(e) => setBusinessForm({...businessForm, contactName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={businessForm.email}
                    onChange={(e) => setBusinessForm({...businessForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={businessForm.phone}
                    onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Employees
                  </label>
                  <select
                    value={businessForm.employees}
                    onChange={(e) => setBusinessForm({...businessForm, employees: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                  >
                    <option value="">Select range</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={businessForm.industry}
                    onChange={(e) => setBusinessForm({...businessForm, industry: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F6D] focus:border-transparent"
                    placeholder="e.g., Technology, Healthcare, Finance"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#F1683B] hover:bg-[#e5572f] text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                Submit Partnership Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#123F6D] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Building2 className="h-8 w-8 text-[#F1683B]" />
                <h4 className="text-2xl font-bold">Assetwise B2B Service</h4>
              </div>
              <p className="text-blue-100 mb-4">
                Providing premium financial services with exclusive discounts for employees of partner companies.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-[#F1683B]" />
                  <span className="text-blue-100">partnerships@assetwise.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-[#F1683B]" />
                  <span className="text-blue-100">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-[#F1683B]" />
                  <span className="text-blue-100">123 Business Ave, Suite 100, City, ST 12345</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors">Financial Planning</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Investment Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Insurance Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tax Consultation</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-8 pt-8 text-center">
            <p className="text-blue-100">
              &copy; 2025 Assetwise B2B Service. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = (username: string, password: string) => {
    // Simple authentication - in production, this should be secure
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginError(null);
  };

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