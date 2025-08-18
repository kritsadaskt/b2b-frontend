import { useState } from "react";
import { Supplier } from "../utils/types";
import { getApiHeaders } from "../utils/api";

// Fallback function to get the correct API URL
const getApiUrl = (endpoint: string): string => {
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    return `/api/${endpoint}`;
  }
  
  // In production, use the full URL
  return `https://api.assetwise.co.th/${endpoint}`;
};

export const useSaveData = (Supplier: Supplier) => {
  const [data, setData] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const body = JSON.stringify(Supplier);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl('Suplier/SaveSuplier');
      console.log('Saving data to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: getApiHeaders(),
        body: body
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
  }

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}