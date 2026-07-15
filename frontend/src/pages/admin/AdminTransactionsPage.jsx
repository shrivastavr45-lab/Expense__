import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api/adminApi';
import { useDebounce } from '../../hooks/useDebounce';
import Pagination from '../../components/common/Pagination';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminTransactionsPage() {
  const [txs, setTxs]       = useState([]);
  const [total, setTotal]   = useState(0);
  const [pages, setPages]   = useState(0);
  const [page, setPage]     = useState(0);
  const [search, setSearch] = useState('');
  const [type, setType]     = useState('');
  const [loading, setLoad]  = useState(true);
  const debounced           = useDebounce(search, 400);

  const load = useCallback(() => {
    setLoad(true);
    adminApi.getTransactions({ page, size: 50, search: debounced||undefined, type: type||undefined })
      .then(r => { setTxs(r.data.content); setTotal(r.data.totalElements); setPages(r.data.totalPages); })
      .finally(() => setLoad(false));
  }, [page, debounced, type]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>
          <span style={{ fontWeight: 600, color: 'var(--ink-1)' }}>{total}</span> platform transactions
        </p>
        <div className="flex gap-3">
          <div className="relative">
            <span className="input-icon"><Search size={14} /></span>
            <input className="input-field has-icon" style={{ width: 240 }} placeholder="Search descriptions…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
          </div>
          <select className="input-field" value={type} onChange={e => { setType(e.target.value); setPage(0); }}>
            <option value="">All types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign:'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {txs.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ fontSize: 11, color: 'var(--ink-4)', whiteSpace: 'nowrap' }}>{formatDate(tx.transactionDate)}</td>
                    <td><p style={{ fontWeight: 500, fontSize: 13, maxWidth: 200 }} className="truncate">{tx.description}</p></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: tx.categoryColor, display: 'inline-block' }} />
                        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{tx.categoryName}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${tx.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                        {tx.type === 'INCOME' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={tx.type === 'INCOME' ? 'amount-income' : 'amount-expense'} style={{ fontSize: 13 }}>
                        {tx.type === 'INCOME' ? '+' : '−'}{formatCurrency(tx.amount, 'INR')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <Pagination page={page} totalPages={pages} totalElements={total} size={50} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
