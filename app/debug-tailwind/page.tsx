'use client';

import { useState } from 'react';

export default function DebugTailwind() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Tailwind CSS Debug Page</h1>
        
        {/* Test basic utility classes */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Basic Utility Classes Test</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-red-500 text-white rounded">Red Background</div>
            <div className="p-4 bg-blue-500 text-white rounded">Blue Background</div>
            <div className="p-4 bg-green-500 text-white rounded">Green Background</div>
          </div>
          
          <div className="space-y-2 mb-6">
            <div className="text-xs">Extra Small Text (text-xs)</div>
            <div className="text-sm">Small Text (text-sm)</div>
            <div className="text-base">Base Text (text-base)</div>
            <div className="text-lg">Large Text (text-lg)</div>
            <div className="text-xl">Extra Large Text (text-xl)</div>
          </div>
          
          <div className="flex space-x-4 mb-6">
            <div className="w-4 h-4 bg-red-500"></div>
            <div className="w-8 h-8 bg-green-500"></div>
            <div className="w-12 h-12 bg-blue-500"></div>
            <div className="w-16 h-16 bg-yellow-500"></div>
          </div>
        </div>

        {/* Test custom theme colors */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Custom Theme Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-accent text-white rounded">
              Accent Color: #F1683B
            </div>
            <div className="p-4 bg-navyblue text-white rounded">
              Navy Blue: #0f3da0
            </div>
          </div>
        </div>

        {/* Test responsive design */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Responsive Design Test</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} className="p-2 bg-blue-100 text-center text-sm">
                Item {i}
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Columns should change based on screen size:</p>
            <ul className="list-disc list-inside">
              <li>Mobile: 1 column</li>
              <li>SM (640px+): 2 columns</li>
              <li>MD (768px+): 3 columns</li>
              <li>LG (1024px+): 4 columns</li>
              <li>XL (1280px+): 5 columns</li>
            </ul>
          </div>
        </div>

        {/* Test transitions and animations */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Animations & Transitions</h2>
          <div className="space-x-4">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
              onClick={() => setShowDetails(!showDetails)}
            >
              Toggle Details (with transition)
            </button>
            <div className="inline-block">
              <div className="w-8 h-8 bg-red-500 rounded animate-pulse"></div>
            </div>
          </div>
          
          {showDetails && (
            <div className="mt-4 p-4 bg-gray-100 rounded transition-all duration-500">
              <p>This content appears with a transition effect!</p>
              <p>If you can see smooth transitions, Tailwind animations are working.</p>
            </div>
          )}
        </div>

        {/* Test flexbox and grid */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Flexbox & Grid Test</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Flexbox (space-between)</h3>
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded">
              <span>Left Item</span>
              <span>Center Item</span>
              <span>Right Item</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">CSS Grid (auto-fit)</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
              <div className="p-4 bg-blue-100 text-center rounded">Grid Item 1</div>
              <div className="p-4 bg-blue-100 text-center rounded">Grid Item 2</div>
              <div className="p-4 bg-blue-100 text-center rounded">Grid Item 3</div>
              <div className="p-4 bg-blue-100 text-center rounded">Grid Item 4</div>
            </div>
          </div>
        </div>

        {/* Test form elements */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Form Elements Test</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Input Field
              </label>
              <input 
                type="text" 
                placeholder="Test input with Tailwind styles"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Field
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            
            <button 
              type="button"
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Submit Button
            </button>
          </form>
        </div>

        {/* Font test */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Font Test</h2>
          <div className="space-y-4">
            <div className="font-sans">
              <p className="text-lg">DBHeavent Font (default): ทดสอบฟอนต์ไทย Thai Font Test 123</p>
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif' }}>
              <p className="text-lg">Arial Font: ทดสอบฟอนต์ไทย Thai Font Test 123</p>
            </div>
          </div>
        </div>

        {/* Diagnostic information */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">Diagnostic Information</h2>
          <div className="text-sm space-y-2">
            <p><strong>If you see this styling correctly:</strong> Tailwind CSS is working!</p>
            <p><strong>If styles are missing:</strong> Check browser dev tools for CSS loading errors</p>
            <p><strong>If fonts don't load:</strong> Check Network tab for font file 404 errors</p>
            <p><strong>Current test URL:</strong> <code className="bg-gray-200 px-1 rounded">http://localhost:3000/debug-tailwind</code></p>
            
            <div className="mt-4 p-4 bg-white rounded border">
              <p className="font-semibold">Quick checks:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Are the colored boxes above showing colors?</li>
                <li>Is the text showing different sizes?</li>
                <li>Do the hover effects work on buttons?</li>
                <li>Is the grid layout responsive?</li>
                <li>Are custom colors (accent/navyblue) working?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
