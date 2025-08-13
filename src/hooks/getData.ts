import { useState, useEffect } from 'react';
import { Supplier } from '../utils/types';

interface DataResponse {
  Data: Supplier[];
}

interface UseGetDataResult {
  data: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGetData = (initialQuery: string = ''): UseGetDataResult => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("supplier_name", "");

    try {
      setLoading(true);
      const response = await fetch('/api/Suplier/GetSuplier', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlencoded
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
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
      const response = await fetch('/api/Suplier/GetSuplierTypeList', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch supplier type list');
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
      const response = await fetch('/api/Suplier/GetSuplierStatusList', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch supplier status list');
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
      const response = await fetch('/api/Suplier/GetSuplierMediaTypeList', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch supplier media type list');
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

