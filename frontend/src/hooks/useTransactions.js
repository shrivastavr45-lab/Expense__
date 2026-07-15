import { useState, useCallback } from 'react';
import { transactionApi } from '../api/transactionApi';
import toast from 'react-hot-toast';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await transactionApi.getAll(params);
      setTransactions(data.content);
      setPagination({ page: data.page, totalPages: data.totalPages, totalElements: data.totalElements });
    } catch (e) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTransaction = async (data) => {
    const res = await transactionApi.create(data);
    toast.success('Transaction added');
    return res.data;
  };

  const updateTransaction = async (id, data) => {
    const res = await transactionApi.update(id, data);
    toast.success('Transaction updated');
    return res.data;
  };

  const deleteTransaction = async (id) => {
    await transactionApi.delete(id);
    toast.success('Transaction deleted');
  };

  return { transactions, pagination, loading, fetchTransactions, createTransaction, updateTransaction, deleteTransaction };
}
