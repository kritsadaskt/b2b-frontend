import { asset } from '../utils/assets';

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <img src={asset('images/logo-hr-02.svg')} alt="Assetwise" width={180} height={80} className="object-contain" />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="https://assetwise.co.th/partners" className="text-gray-600 hover:text-[#123F6D] transition-colors">สมัครเป็นพาร์ทเนอร์</a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header;