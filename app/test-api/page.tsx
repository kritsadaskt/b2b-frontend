'use client';

import { useState } from 'react';

export default function TestAPI() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/Suplier/GetSuplier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'supplier_name='
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setLoading(true);
    try {
      // This will fail due to CORS, but we can see the error
      const response = await fetch('https://aswinno.assetwise.co.th/APIUAT/Suplier/GetSuplier', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'supplier_name='
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Direct API Error (expected CORS): ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Testing Page</h1>
      
      <div className="space-y-4 mb-8">
        <button 
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Proxy API'}
        </button>
        
        <button 
          onClick={testDirectAPI}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Direct API (will fail)'}
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Result:</h2>
        <pre className="text-sm overflow-auto max-h-96">{result}</pre>
      </div>
    </div>
  );
}
