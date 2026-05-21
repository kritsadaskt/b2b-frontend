import { useState, useEffect, useCallback } from 'react';
import { Supplier, B2bLeadResponse } from '../utils/types';
import { createApiUrl, getApiHeaders } from '../utils/api';
import {
  fetchSupplierTypeList,
  getCachedSupplierTypes,
  type SupplierTypeItem,
} from '../utils/supplierTypeCache';

interface DataResponse {
  Data: Supplier[];
}

export interface GetSupplierQuery {
  supplier_name?: string;
  is_active?: boolean;
}

interface UseGetDataResult {
  data: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGetData = (query: string | GetSupplierQuery = ''): UseGetDataResult => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supplierName = typeof query === 'string' ? query : (query.supplier_name ?? '');
  const isActive = typeof query === 'string' ? undefined : query.is_active;

  const fetchData = async () => {
    const urlencoded = new URLSearchParams();
    urlencoded.append('supplier_name', supplierName);
    if (isActive === true) {
      urlencoded.append('is_active', 'true');
    } else if (isActive === false) {
      urlencoded.append('is_active', 'false');
    }

    try {
      setLoading(true);
      const response = await fetch(createApiUrl('Suplier/GetSuplier'), {
        method: 'POST',
        headers: {
          ...getApiHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlencoded,
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
  }, [supplierName, isActive]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

interface UseGetSupplierTypeListResult {
  data: SupplierTypeItem[] | string[];
  loading: boolean;
  error: string | null;
  refetch: (force?: boolean) => Promise<void>;
}

export const useGetSupplierTypeList = (
  returnOnlyName: boolean = false,
): UseGetSupplierTypeListResult => {
  const cached = getCachedSupplierTypes();
  const [data, setData] = useState<SupplierTypeItem[] | string[]>(() => {
    if (!cached) return [];
    return returnOnlyName ? cached.map((item) => item.name) : cached;
  });
  const [loading, setLoading] = useState(() => !cached);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (force = false) => {
      try {
        if (!force && getCachedSupplierTypes()) {
          const types = getCachedSupplierTypes()!;
          setData(returnOnlyName ? types.map((item) => item.name) : types);
          setError(null);
          return;
        }

        setLoading(true);
        const types = await fetchSupplierTypeList({ force });
        setData(returnOnlyName ? types.map((item) => item.name) : types);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred while fetching supplier type list',
        );
        console.error('Error fetching supplier type list:', err);
      } finally {
        setLoading(false);
      }
    },
    [returnOnlyName],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
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
      const response = await fetch(createApiUrl('Suplier/GetSuplierStatusList'), {
        method: 'GET',
        headers: {
          ...getApiHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
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
    refetch: fetchData,
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
      const response = await fetch(createApiUrl('Suplier/GetSuplierMediaTypeList'), {
        method: 'GET',
        headers: {
          ...getApiHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
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
    refetch: fetchData,
  };
};

interface SupplierLeadsResult {
  id: string;
  Fname: string;
  Lname: string;
  Tel: string;
  Email: string;
  CompanyID: string;
  InterestedProject: number;
  Source: string[];
  TypeInterest: string[];
}

interface UseGetSupplierLeadsResult {
  data: SupplierLeadsResult[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGetSupplierLeads = (): UseGetSupplierLeadsResult => {
  const [data, setData] = useState<SupplierLeadsResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(createApiUrl('Suplier/GetSuplierLeads'), {
        method: 'GET',
        headers: {
          ...getApiHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch supplier leads: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setData(result.Data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching supplier leads');
      console.error('Error fetching supplier leads:', err);
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
    refetch: fetchData,
  };
};

interface UseGetApiLeadsResult {
  data: B2bLeadResponse[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGetApiLeads = (): UseGetApiLeadsResult => {
  const [data, setData] = useState<B2bLeadResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(createApiUrl('Suplier/GetSuplierLeadList'), {
        method: 'POST',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setData(result.Data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching leads');
      console.error('Error fetching leads:', err);
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
    refetch: fetchData,
  };
};
