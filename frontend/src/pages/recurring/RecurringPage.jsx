import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, PauseCircle, PlayCircle, RefreshCw, Calendar } from 'lucide-react';
import { recurringApi } from '../../api/recurringApi';
import { useCategories } from '../../hooks/useCategories';
import { useAuthStore } from '../../store/authStore';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const EMPTY = { categoryId:'', amount:'', description:'', intervalType:'MONTHLY', startDate:'', endDate:'', notes:'' };

const INTERVAL_COLORS = { DAILY: '#3D8B7A', WEEKLY: '#6366F1', MONTHLY: '#1A3C34' };

export default function RecurringPage() {
  const { user } = useAuthStore();
  const { expenseCategories } = useCategories();
  const currency = user?.currency ?? 'INR';
  const [items, setItems]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [modal, setModal]   = useState(false);
  const [editing, setEdit]  = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSave]   = useState(false);
  const [delId, setDelId]   = useState(null);

  const load = () => recurringApi.getAll().then(r => setItems(r.data)).finally(() => setLoad(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEdit(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (item) => {
    setEdit(item);
    setForm({ categoryId: item.categoryId, amount: item.amount, description: item.description,
      intervalType: item.intervalType, startDate: item.nextDueDate?.split('T')[0] ?? '', endDate: item.endDate?.split('T')[0] ?? '', notes: item.notes ?? '' });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId || !form.amount || !form.description || !form.startDate) { toast.error('Fill all required fields'); return; }
    setSave(true);
    try {
      editing ? await recurringApi.update(editing.id, form) : await recurringApi.create(form);
      toast.success(editing ? 'Updated' : 'Recurring expense created');
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message ?? 'Failed'); }
    finally { setSave(false); }
  };

  const handleToggle = async (id) => {
    try { await recurringApi.toggle(id); load(); toast.success('Status updated'); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async () => {
    try { await recurringApi.delete(delId); setDelId(null); load(); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  const totalMonthly = items.filter(i => i.active && i.intervalType === 'MONTHLY')
    .reduce((s, i) => s + parseFloat(i.amount), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>
          <span style={{ fontWeight: 600, color: 'var(--ink-1)' }}>{items.filter(i => i.active).length}</span> active recurring
        </p>
        <Button onClick={openCreate}><Plus size={15} /> New Recurring</Button>
      </div>

      {/* Monthly summary */}
      {items.length > 0 && (
        <div className="card p-5 flex items-center gap-4" style={{ background: 'var(--accent-light)' }}>
          <div className="flex items-center justify-center rounded-xl"
               style={{ width: 44, height: 44, background: 'var(--accent)', flexShrink: 0 }}>
            <RefreshCw size={20} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Monthly auto-charges</p>
            <p className="font-number" style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{formatCurrency(totalMonthly, currency)}</p>
          </div>
        </div>
      )}

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="card h-44 skeleton" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={RefreshCw} title="No recurring expenses"
          description="Set up bills, subscriptions, or regular payments to auto-post on a schedule."
          action={<Button onClick={openCreate}><Plus size={14} />Add Recurring</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className={`card card-hover ${!item.active ? 'opacity-60' : ''}`}>
              <div className="p-5">
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }} className="truncate">{item.description}</p>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--ink-4)' }}>{item.categoryName}</p>
                  </div>
                  <span className="badge badge-neutral shrink-0 ml-2"
                        style={item.active ? { background: 'var(--accent-light)', color: 'var(--accent)' } : {}}>
                    {item.active ? 'Active' : 'Paused'}
                  </span>
                </div>
                {/* Amount + interval */}
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="font-number" style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink-1)', lineHeight: 1 }}>
                      {formatCurrency(item.amount, currency)}
                    </p>
                    <span className="badge mt-1.5" style={{ background: `${INTERVAL_COLORS[item.intervalType]}20`, color: INTERVAL_COLORS[item.intervalType] }}>
                      {item.intervalType.charAt(0) + item.intervalType.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="flex items-center gap-1 justify-end" style={{ color: 'var(--ink-4)' }}>
                      <Calendar size={11} />
                      <span style={{ fontSize: 11 }}>Next</span>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-2)' }}>{formatDate(item.nextDueDate)}</p>
                    {item.endDate && <p style={{ fontSize: 11, color: 'var(--ink-4)' }}>ends {formatDate(item.endDate)}</p>}
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex" style={{ borderTop: '1px solid var(--border)' }}>
                {[
                  { icon: item.active ? PauseCircle : PlayCircle, label: item.active ? 'Pause' : 'Resume', action: () => handleToggle(item.id) },
                  { icon: Pencil,  label: 'Edit',   action: () => openEdit(item) },
                  { icon: Trash2,  label: 'Delete', action: () => setDelId(item.id), danger: true },
                ].map(({ icon: Icon, label, action, danger }) => (
                  <button key={label} onClick={action}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors"
                    style={{ color: danger ? 'var(--ink-4)' : 'var(--ink-3)', borderRight: label !== 'Delete' ? '1px solid var(--border)' : 'none', background: 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = danger ? '#FEE2E2' : 'var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modal} onClose={() => setModal(false)}
        title={editing ? 'Edit Recurring' : 'New Recurring Expense'}
        description="Set up a scheduled automatic transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Category" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
            <option value="">Select category…</option>
            {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Amount" type="number" step="0.01" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            <Select label="Interval" value={form.intervalType} onChange={e => setForm(f => ({ ...f, intervalType: e.target.value }))}>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </Select>
          </div>
          <Input label="Description" placeholder="Netflix, Rent, Gym…"
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start date" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            <Input label="End date (optional)" type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="secondary" type="button" onClick={() => setModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!delId} onClose={() => setDelId(null)} title="Delete recurring expense?" size="sm">
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setDelId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
