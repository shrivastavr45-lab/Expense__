import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, SlidersHorizontal, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useCategories } from '../../hooks/useCategories';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuthStore } from '../../store/authStore';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonCard } from '../../components/common/Skeleton';
import { formatCurrency, formatDate, formatDateInput } from '../../utils/formatters';
import toast from 'react-hot-toast';

const EMPTY = { amount:'', type:'EXPENSE', categoryId:'', description:'', transactionDate: formatDateInput(new Date()), notes:'' };

export default function TransactionsPage() {
  const { user } = useAuthStore();
  const { transactions, pagination, loading, fetchTransactions, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { categories } = useCategories();
  const currency = user?.currency ?? 'INR';

  const [search, setSearch]     = useState('');
  const [typeFilter, setType]   = useState('');
  const [catFilter, setCat]     = useState('');
  const [fromDate, setFrom]     = useState('');
  const [toDate, setTo]         = useState('');
  const [page, setPage]         = useState(0);
  const [showFilters, setShowF] = useState(false);
  const debSearch               = useDebounce(search, 400);

  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [submitting, setSubmit] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    fetchTransactions({ page, size: 15, search: debSearch||undefined, type: typeFilter||undefined,
      categoryId: catFilter||undefined, from: fromDate||undefined, to: toDate||undefined });
  }, [page, debSearch, typeFilter, catFilter, fromDate, toDate]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (tx) => {
    setEditing(tx);
    setForm({ amount: tx.amount, type: tx.type, categoryId: tx.categoryId,
      description: tx.description, transactionDate: formatDateInput(new Date(tx.transactionDate)), notes: tx.notes ?? '' });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.categoryId || !form.description) { toast.error('Fill all required fields'); return; }
    setSubmit(true);
    try {
      editing ? await updateTransaction(editing.id, form) : await createTransaction(form);
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message ?? 'Failed to save'); }
    finally { setSubmit(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await deleteTransaction(deleteId); setDeleteId(null); load(); }
    catch { toast.error('Delete failed'); }
    finally { setDeleting(false); }
  };

  const filteredCats = categories.filter(c => !form.type || c.type === form.type);
  const hasFilters   = typeFilter || catFilter || fromDate || toDate;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>
            <span style={{ fontWeight: 600, color: 'var(--ink-1)' }}>{pagination.totalElements}</span> transactions total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowF(f => !f)}
            style={hasFilters ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}>
            <SlidersHorizontal size={13} />
            Filters
            {hasFilters && <span className="badge badge-accent" style={{ fontSize: 10, padding: '1px 5px', marginLeft: 2 }}>on</span>}
          </Button>
          <Button onClick={openCreate}><Plus size={15} /> Add Transaction</Button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="card p-4 space-y-3">
        <div className="relative">
          <span className="input-icon"><Search size={15} /></span>
          <input className="input-field has-icon" placeholder="Search by description…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
        </div>
        {showFilters && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <Select value={typeFilter} onChange={e => { setType(e.target.value); setPage(0); }}>
              <option value="">All types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </Select>
            <Select value={catFilter} onChange={e => { setCat(e.target.value); setPage(0); }}>
              <option value="">All categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <input className="input-field" type="date" value={fromDate} onChange={e => setFrom(e.target.value)} />
            <div className="flex gap-2">
              <input className="input-field flex-1" type="date" value={toDate} onChange={e => setTo(e.target.value)} />
              {hasFilters && (
                <button className="btn btn-secondary btn-icon btn-sm"
                  onClick={() => { setType(''); setCat(''); setFrom(''); setTo(''); }}>
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState icon={ArrowLeftRight}
            title="No transactions found"
            description="Add your first transaction to start tracking your finances."
            action={<Button onClick={openCreate}><Plus size={14} />Add Transaction</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ fontSize: 12, color: 'var(--ink-4)', whiteSpace: 'nowrap' }}>
                      {formatDate(tx.transactionDate)}
                    </td>
                    <td>
                      <p style={{ fontWeight: 500, color: 'var(--ink-1)', maxWidth: 200 }} className="truncate">{tx.description}</p>
                      {tx.notes && <p style={{ fontSize: 11, color: 'var(--ink-4)' }} className="truncate">{tx.notes}</p>}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: tx.categoryColor, flexShrink: 0, display: 'inline-block' }} />
                        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{tx.categoryName}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${tx.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                        {tx.type === 'INCOME'
                          ? <ArrowUpRight size={10} />
                          : <ArrowDownRight size={10} />
                        }
                        {tx.type === 'INCOME' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={tx.type === 'INCOME' ? 'amount-income' : 'amount-expense'}>
                        {tx.type === 'INCOME' ? '+' : '−'}{formatCurrency(tx.amount, currency)}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(tx)} className="btn btn-ghost btn-icon btn-sm"
                                style={{ color: 'var(--ink-4)' }}>
                          <Pencil size={13} />
                        </button>
                        <button className="p-1 rounded hover:bg-black/20 transition-colors"
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--expense)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-4)'}
                                style={{ color: 'var(--ink-4)' }}
                                onClick={() => setDeleteId(tx.id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {transactions.length > 0 && (
          <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)' }}>
            <Pagination page={pagination.page} totalPages={pagination.totalPages}
              totalElements={pagination.totalElements} size={15} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={modal} onClose={() => setModal(false)}
        title={editing ? 'Edit Transaction' : 'New Transaction'}
        description={editing ? 'Update transaction details' : 'Record a new income or expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value, categoryId: '' }))}>
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </Select>
            <Input label="Amount" type="number" step="0.01" min="0.01" placeholder="0.00"
              value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </div>
          <Select label="Category" value={form.categoryId}
            onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
            <option value="">Select category…</option>
            {filteredCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Input label="Description" placeholder="What was this for?"
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Input label="Date" type="date"
            value={form.transactionDate} onChange={e => setForm(f => ({ ...f, transactionDate: e.target.value }))} />
          <div>
            <label className="input-label">Notes (optional)</label>
            <textarea className="input-field" rows={2} placeholder="Additional notes…"
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="secondary" type="button" onClick={() => setModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={submitting} className="flex-1">
              {editing ? 'Update' : 'Add'} Transaction
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete transaction?" size="sm"
        description="This action cannot be undone.">
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

function ArrowLeftRight({ size, className }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>;
}
