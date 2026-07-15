import { useState, useEffect } from 'react';
import { categoryApi } from '../api/categoryApi';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryApi.getAll()
      .then(r => setCategories(r.data))
      .finally(() => setLoading(false));
  }, []);

  const expenseCategories = categories.filter(c => c.type === 'EXPENSE');
  const incomeCategories  = categories.filter(c => c.type === 'INCOME');

  return { categories, expenseCategories, incomeCategories, loading };
}
