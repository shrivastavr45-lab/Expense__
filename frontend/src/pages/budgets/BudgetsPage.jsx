import { useEffect, useState } from 'react';
import { Plus, Trash2, AlertTriangle, Target, TrendingDown } from 'lucide-react';
import { useBudgets } from '../../hooks/useBudgets';
import { useCategories } from '../../hooks/useCategories';
import { useAuthStore } from '../../store/authStore';
import { budgetApi } from '../../api/budgetApi';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const EMPTY = { categoryId:'', limitAmount:'', period:'MONTHLY', startDate:'', endDate:'', alertThreshold:80 };

export default function BudgetsPage() {
  const { user } = useAuthStore();
  const { budgets, loading, fetchBudgets, deleteBudget } = useBudgets();
  const { expenseCategories } = useCategories();
  const [modal, setModal]  = useState(false);
  const [form, setForm]    = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [delId, setDelId]  = useState(null);
  const currency = user?.currency ?? 'INR';

  useEffect(() => { fetchBudgets(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId || !form.limitAmount || !form.startDate || !form.endDate) {
      toast.error('Fill all required fields'); return;
    }
    setSaving(true);
    try {
      await budgetApi.create(form);
      toast.success('Budget created');
      setModal(false); fetchBudgets();
    } catch (err) { toast.error(err.response?.data?.message ?? 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await deleteBudget(delId); setDelId(null); fetchBudgets(); }
    catch { toast.error('Delete failed'); }
  };

  // Summary stats
  const totalLimit   = budgets.reduce((s, b) => s + parseFloat(b.limitAmount), 0);
  const totalSpent   = budgets.reduce((s, b) => s + parseFloat(b.spentAmount), 0);
  const overBudget   = budgets.filter(b => b.overBudget).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>
          <span style={{ fontWeight: 600, color: 'var(--ink-1)' }}>{budgets.length}</span> active budgets
        </p>
        <Button onClick={() => { setForm(EMPTY); setModal(true); }}>
          <Plus size={15} /> New Budget
        </Button>
      </div>

      {/* Summary row */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total budget limit', value: formatCurrency(totalLimit, currency), accent: 'var(--ink-1)' },
            { label: 'Total spent',        value: formatCurrency(totalSpent, currency), accent: '#D97706' },
            { label: 'Over budget',        value: `${overBudget} budget${overBudget !== 1 ? 's' : ''}`, accent: overBudget > 0 ? '#DC2626' : 'var(--income)' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <p style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>{s.label}</p>
              <p className="font-number" style={{ fontSize: 20, fontWeight: 700, color: s.accent }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Budget Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="card h-52 skeleton" />)}
        </div>
      ) : budgets.length === 0 ? (
        <EmptyState icon={Target} title="No budgets yet"
          description="Set monthly spending limits per category to stay in control."
          action={<Button onClick={() => setModal(true)}><Plus size={14} />Create Budget</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {budgets.map(b => <BudgetCard key={b.id} b={b} currency={currency} onDelete={setDelId} />)}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Create Budget" description="Set a spending limit for a category">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Category" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
            <option value="">Select expense category…</option>
            {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Limit amount" type="number" step="0.01" placeholder="0.00"
              value={form.limitAmount} onChange={e => setForm(f => ({ ...f, limitAmount: e.target.value }))} />
            <Select label="Period" value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))}>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start date" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            <Input label="End date"   type="date" value={form.endDate}   onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
          </div>
          <div>
            <label className="input-label">Alert at {form.alertThreshold}% usage</label>
            <input type="range" min="50" max="100" step="5"
              className="w-full mt-1" style={{ accentColor: 'var(--accent)' }}
              value={form.alertThreshold} onChange={e => setForm(f => ({ ...f, alertThreshold: Number(e.target.value) }))} />
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="secondary" type="button" onClick={() => setModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">Create Budget</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!delId} onClose={() => setDelId(null)} title="Delete budget?" size="sm" description="This cannot be undone.">
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setDelId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

function BudgetCard({ b, currency, onDelete }) {
  const pct   = Math.min(b.usagePercentage, 100);
  const color = pct >= 100 ? 'var(--expense)' : pct >= b.alertThreshold ? 'var(--warn)' : 'var(--accent)';
  const bgGradient = pct >= 100
    ? 'rgba(244, 63, 94, 0.1)'
    : pct >= b.alertThreshold
      ? 'rgba(245, 158, 11, 0.1)'
      : 'var(--surface)';

  return (
    <div className="card card-hover" style={{ background: bgGradient }}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: b.categoryColor ?? color, display: 'inline-block' }} />
              <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-1)' }}>{b.categoryName}</p>
              {b.overBudget && (
                <span className="badge badge-expense"><AlertTriangle size={9} />Over</span>
              )}
            </div>
            <p style={{ fontSize: 11, color: 'var(--ink-4)' }}>
              {b.period.charAt(0) + b.period.slice(1).toLowerCase()} · ends {formatDate(b.endDate)}
            </p>
          </div>
          <button onClick={() => onDelete(b.id)} className="p-1 rounded hover:bg-black/20 transition-colors"
                  style={{ color: 'var(--ink-5)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--expense)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-5)'}>
            <Trash2 size={13} />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', color }}>
              {formatCurrency(b.spentAmount, currency)}
            </span>
            <span style={{ fontSize: 14, color: 'var(--ink-4)', alignSelf: 'flex-end', marginBottom: 2 }}>
              / {formatCurrency(b.limitAmount, currency)}
            </span>
          </div>
          <div className="progress-track h-2">
            <div className="progress-bar h-2" style={{ width: `${pct}%`, background: color }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span style={{ fontSize: 11, color, fontWeight: 600 }}>{pct.toFixed(0)}% used</span>
            <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>
              {formatCurrency(b.remainingAmount, currency)} left
            </span>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 flex justify-between" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>Alert at {b.alertThreshold}%</span>
        <span className={`badge ${b.alertSent ? 'badge-warn' : 'badge-neutral'}`} style={{ fontSize: 10 }}>
          {b.alertSent ? 'Alert sent' : 'Watching'}
        </span>
      </div>
    </div>
  );
}
