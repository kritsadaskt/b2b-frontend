import { useState, useEffect } from 'react';
import { Supplier } from '../utils/types';
import { createApiUrl, getApiHeaders } from '../utils/api';

interface DataResponse {
  Data: Supplier[];
}

interface UseGetDataResult {
  data: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Fallback function to get the correct API URL
const getApiUrl = (endpoint: string): string => {
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    return `/api/${endpoint}`;
  }
  
  // In production, use the Netlify function proxy to avoid CORS
  return `/.netlify/functions/api-proxy/${endpoint}`;
};

export const useGetData = (initialQuery: string = ''): UseGetDataResult => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("supplier_name", "");

    try {
      setLoading(true);
      const apiUrl = getApiUrl('Suplier/GetSuplier');
      console.log('Fetching data from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          ...getApiHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlencoded
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }

      const result: DataResponse = await response.json();
      setData(result.Data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [initialQuery]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

interface UseGetSupplierTypeListResult {
  data: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGetSupplierTypeList = (returnOnlyName: boolean = false): UseGetSupplierTypeListResult => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl('Suplier/GetSuplierTypeList');
      console.log('Fetching supplier type list from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          ...getApiHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch supplier type list: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (returnOnlyName) {
        setData((result.Data || []).map((item: any) => item.supplier_name));
      } else {
        setData(result.Data || []);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching supplier type list');
      console.error('Error fetching supplier type list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [returnOnlyName]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

interface UseGetSupplierStatusListResult {
  data: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGetSupplierStatusList = (): UseGetSupplierStatusListResult => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl('Suplier/GetSuplierStatusList');
      console.log('Fetching supplier status list from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          ...getApiHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch supplier status list: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setData(result.Data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching supplier status list');
      console.error('Error fetching supplier status list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

interface UseGetSupplierMediaTypeListResult {
  data: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGetSupplierMediaTypeList = (): UseGetSupplierMediaTypeListResult => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl('Suplier/GetSuplierMediaTypeList');
      console.log('Fetching supplier media type list from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          ...getApiHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch supplier media type list: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setData(result.Data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching supplier media type list');
      console.error('Error fetching supplier media type list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

