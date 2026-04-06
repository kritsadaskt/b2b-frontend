import { useState } from 'react';
import { B2bLead, B2bLeadResponse, Supplier } from '../utils/types';
import { createApiUrl, getApiHeaders } from '../utils/api';

export const useSaveData = (Supplier: Supplier) => {
  const [data, setData] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const body = JSON.stringify(Supplier);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(createApiUrl('Suplier/SaveSuplier'), {
        method: 'POST',
        headers: getApiHeaders(),
        body: body,
      });

      if (!response.ok) {
        throw new Error(`Failed to save data: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
      setError(null);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving data');
      console.error('Error saving data:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export const useSaveLeadData = (LeadData: B2bLead) => {
  const [data, setData] = useState<B2bLeadResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveLeadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(createApiUrl('Suplier/SaveSuplierLead'), {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(LeadData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save lead data: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const normalized = Array.isArray(result) ? result : [result];
      setData(normalized);

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving lead data');
      console.error('Error saving lead data:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: saveLeadData,
  };
};
