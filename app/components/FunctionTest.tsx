import React, { useState } from 'react';

const FunctionTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testBasicFunction = async () => {
    setLoading(true);
    setTestResult('Testing basic function...\n');
    
    try {
      const response = await fetch('/.netlify/functions/test');
      setTestResult(prev => prev + `Status: ${response.status} ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(prev => prev + `Success! Data: ${JSON.stringify(data, null, 2)}\n`);
      } else {
        const errorText = await response.text();
        setTestResult(prev => prev + `Error: ${errorText}\n`);
      }
    } catch (error) {
      setTestResult(prev => prev + `Exception: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testApiProxy = async () => {
    setLoading(true);
    setTestResult('Testing API proxy...\n');
    
    try {
      const response = await fetch('/.netlify/functions/api-proxy/Suplier/GetSuplierTypeList', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=',
          'Content-Type': 'application/json',
        }
      });
      
      setTestResult(prev => prev + `Status: ${response.status} ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(prev => prev + `Success! Data: ${JSON.stringify(data, null, 2)}\n`);
      } else {
        const errorText = await response.text();
        setTestResult(prev => prev + `Error: ${errorText}\n`);
      }
    } catch (error) {
      setTestResult(prev => prev + `Exception: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Netlify Function Test</h3>
      <div className="space-x-4 mb-4">
        <button 
          onClick={testBasicFunction}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Basic Function'}
        </button>
        <button 
          onClick={testApiProxy}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API Proxy'}
        </button>
      </div>
      <pre className="mt-4 p-4 bg-white border rounded text-sm overflow-auto max-h-96">
        {testResult || 'Click buttons to test functions...'}
      </pre>
    </div>
  );
};

export default FunctionTest;
