import { format, parseISO, isValid } from 'date-fns';

export const formatCurrency = (amount, currency = 'INR') => {
  if (amount == null || amount === '') return '—';
  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(num);
};

export const formatDate = (date) => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '—';
    return format(d, 'MMM d, yyyy');
  } catch { return '—'; }
};

export const formatDateInput = (date) => {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return '';
    return format(d, 'yyyy-MM-dd');
  } catch { return ''; }
};

export const formatPercent = (value) => `${Number(value).toFixed(1)}%`;

export const truncate = (str, n = 30) =>
  str && str.length > n ? str.slice(0, n) + '…' : str;
