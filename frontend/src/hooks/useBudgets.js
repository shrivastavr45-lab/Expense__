import { useState, useCallback } from 'react';
import { budgetApi } from '../api/budgetApi';
import toast from 'react-hot-toast';

export function useBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await budgetApi.getActive();
      setBudgets(data);
    } catch { toast.error('Failed to load budgets'); }
    finally   { setLoading(false); }
  }, []);

  const createBudget = async (data) => {
    const res = await budgetApi.create(data);
    toast.success('Budget created');
    return res.data;
  };

  const deleteBudget = async (id) => {
    await budgetApi.delete(id);
    toast.success('Budget deleted');
  };

  return { budgets, loading, fetchBudgets, createBudget, deleteBudget };
}
