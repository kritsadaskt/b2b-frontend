'use client';

import React, { useState } from 'react';
import { createApiUrl, getApiHeaders } from '../utils/api';

const ApiTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApiCall = async () => {
    setLoading(true);
    setTestResult('Testing API call...\n');

    const apiUrl = createApiUrl('Suplier/GetSuplierTypeList');
    setTestResult((prev) => prev + `NODE_ENV: ${process.env.NODE_ENV}\nAPI URL: ${apiUrl}\n`);

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          ...getApiHeaders(),
        },
      });

      setTestResult((prev) => prev + `Response status: ${response.status} ${response.statusText}\n`);

      if (response.ok) {
        const data = await response.json();
        setTestResult((prev) => prev + `Success! Data: ${JSON.stringify(data, null, 2)}\n`);
      } else {
        const errorText = await response.text();
        setTestResult((prev) => prev + `Error response: ${errorText}\n`);
      }
    } catch (error) {
      setTestResult((prev) => prev + `Exception: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">API Test Component</h3>
      <button
        onClick={testApiCall}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test API Call'}
      </button>
      <pre className="mt-4 p-4 bg-white border rounded text-sm overflow-auto max-h-96">
        {testResult || 'Click "Test API Call" to see results...'}
      </pre>
    </div>
  );
};

export default ApiTest;
