import { useState } from "react";
import { Supplier } from "../utils/types";
import { API_BASE_URL } from "../utils/api";

export const useSaveData = (Supplier: Supplier) => {
  const [data, setData] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const header = new Headers();
  header.append("Authorization", "Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=");
  header.append("Content-Type", "application/json");

  const body = JSON.stringify(Supplier);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/Suplier/SaveSuplier`, {
        method: 'POST',
        headers: header,
        body: body
      });
    
      if (!response.ok) {
        throw new Error('Failed to save data');
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