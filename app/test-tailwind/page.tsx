export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Tailwind CSS Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Colors</h2>
            <div className="space-y-2">
              <div className="w-full h-4 bg-red-500 rounded"></div>
              <div className="w-full h-4 bg-green-500 rounded"></div>
              <div className="w-full h-4 bg-blue-500 rounded"></div>
              <div className="w-full h-4 bg-yellow-500 rounded"></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Spacing & Layout</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Flex</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Grid</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-300 rounded"></div>
              <div className="h-2 bg-gray-400 rounded"></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Typography</h2>
            <p className="text-lg font-bold mb-2">Bold Text</p>
            <p className="text-base font-medium mb-2">Medium Text</p>
            <p className="text-sm font-normal mb-2">Normal Text</p>
            <p className="text-xs text-gray-500">Small Text</p>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Interactive Elements</h2>
          <div className="space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
              Secondary Button
            </button>
            <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors">
              Outline Button
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Custom Colors (from config)</h2>
          <div className="flex space-x-4">
            <div className="w-20 h-20 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">Accent</span>
            </div>
            <div className="w-20 h-20 bg-navyblue rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">Navy</span>
            </div>
          </div>
        </div>
        
        {/* Test responsive design */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Responsive Test</h2>
          <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
            This text changes size based on screen size
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <div className="bg-red-200 p-2 text-center">1</div>
            <div className="bg-green-200 p-2 text-center">2</div>
            <div className="bg-blue-200 p-2 text-center">3</div>
            <div className="bg-yellow-200 p-2 text-center">4</div>
          </div>
        </div>
      </div>
    </div>
  );
}
