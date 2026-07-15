import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Wallet, Target,
  Plus, ArrowRight, ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';
import { analyticsApi } from '../../api/analyticsApi';
import { transactionApi } from '../../api/transactionApi';
import { budgetApi } from '../../api/budgetApi';
import { useAuthStore } from '../../store/authStore';
import StatCard from '../../components/common/StatCard';
import { SkeletonCard } from '../../components/common/Skeleton';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

const GREETING = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 shadow-lg" style={{ minWidth: 140 }}>
      <p style={{ fontSize: 11, color: 'var(--ink-4)', marginBottom: 8 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.fill, display: 'inline-block' }} />
            {p.name}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace' }}>
            {formatCurrency(p.value, currency)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { user }  = useAuthStore();
  const currency  = user?.currency ?? 'INR';
  const [summary, setSummary]   = useState(null);
  const [recent,  setRecent]    = useState([]);
  const [budgets, setBudgets]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.getCurrentMonth(),
      transactionApi.getRecent(),
      budgetApi.getActive(),
    ]).then(([s, r, b]) => {
      setSummary(s.data);
      setRecent(r.data);
      setBudgets(b.data.slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  const chartData = summary?.monthlyData?.map(m => ({
    name:     m.monthLabel,
    Income:   Number(m.income   ?? 0),
    Expenses: Number(m.expenses ?? 0),
  })) ?? [];

  if (loading) return (
    <div className="space-y-6">
      <div className="skeleton rounded-lg" style={{ height: 32, width: 280 }} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} rows={2} />)}
      </div>
    </div>
  );

  const savingsRate = summary?.totalIncome > 0
    ? Math.max(0, ((summary.totalIncome - summary.totalExpenses) / summary.totalIncome) * 100).toFixed(1) + '%'
    : '—';

  return (
    <div className="space-y-7 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} color="var(--accent-bright)" />
            <span style={{ fontSize: 12, color: 'var(--ink-4)', fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
            </span>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink-1)', letterSpacing: '-0.02em' }}>
            {GREETING()}, {user?.firstName ?? user?.username} 👋
          </h2>
          <p style={{ fontSize: 13, color: 'var(--ink-4)', marginTop: 2 }}>
            Here's your financial snapshot this month
          </p>
        </div>
        <Link to="/transactions" className="btn btn-primary shrink-0">
          <Plus size={15} /> Add Transaction
        </Link>
      </div>

      {/* ── Net Balance Hero ── */}
      <div className="card p-6" style={{ background: 'var(--accent)', border: 'none' }}>
        <div className="flex items-start justify-between">
          <div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Net balance this month
            </p>
            <p className="font-number" style={{ color: '#fff', fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 8, lineHeight: 1 }}>
              {formatCurrency(summary?.netBalance ?? 0, currency)}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                <ArrowUpRight size={14} color="#6ee7b7" />
                <span style={{ color: '#6ee7b7', fontSize: 13, fontWeight: 500 }}>
                  {formatCurrency(summary?.totalIncome ?? 0, currency)}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>income</span>
              </div>
              <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)' }} />
              <div className="flex items-center gap-1.5">
                <ArrowDownRight size={14} color="#fca5a5" />
                <span style={{ color: '#fca5a5', fontSize: 13, fontWeight: 500 }}>
                  {formatCurrency(summary?.totalExpenses ?? 0, currency)}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>expenses</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center rounded-2xl"
               style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.12)' }}>
            <Wallet size={26} color="rgba(255,255,255,0.9)" />
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Income"   value={formatCurrency(summary?.totalIncome   ?? 0, currency)} icon={TrendingUp}   accent="income"  />
        <StatCard title="Total Expenses" value={formatCurrency(summary?.totalExpenses ?? 0, currency)} icon={TrendingDown} accent="expense" />
        <StatCard title="Savings Rate"   value={savingsRate} icon={Zap} accent="accent" />
        <StatCard title="Active Budgets" value={budgets.length} icon={Target} accent="purple" />
      </div>

      {/* ── Chart + Recent ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Chart */}
        <div className="card p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>Income vs Expenses</h3>
              <p style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }}>This month's financial flow</p>
            </div>
            <div className="flex items-center gap-4">
              {[['Income','var(--accent)'],['Expenses','var(--expense)']].map(([n,c]) => (
                <span key={n} className="flex items-center gap-1.5" style={{ fontSize: 11, color: 'var(--ink-4)' }}>
                  <span style={{ width: 8, height: 8, background: c, borderRadius: 2, display: 'inline-block', opacity: n === 'Expenses' ? 0.7 : 1 }} />{n}
                </span>
              ))}
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barCategoryGap="35%" barGap={4}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink-4)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--ink-4)' }} tickLine={false} axisLine={false}
                  tickFormatter={v => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} width={45} />
                <Tooltip content={<CustomTooltip currency={currency} />} cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 6 }} />
                <Bar dataKey="Income"   fill="var(--accent)" radius={[5,5,0,0]} />
                <Bar dataKey="Expenses" fill="var(--expense)" fillOpacity={0.7} radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center" style={{ height: 200, color: 'var(--ink-4)', fontSize: 13 }}>
              No data for this month yet
            </div>
          )}
        </div>

        {/* Recent transactions */}
        <div className="card lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>Recent</h3>
            <Link to="/transactions" className="flex items-center gap-1"
                  style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex-1">
            {recent.length === 0 && (
              <div className="flex items-center justify-center" style={{ height: 120, color: 'var(--ink-4)', fontSize: 13 }}>
                No transactions yet
              </div>
            )}
            {recent.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                   style={{ borderBottom: '1px solid var(--border)' }}
                   onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                   onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div className="flex items-center justify-center rounded-xl shrink-0 text-white"
                     style={{ width: 36, height: 36, background: tx.categoryColor || 'var(--accent)', fontSize: 12, fontWeight: 700 }}>
                  {tx.categoryName?.[0] ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-1)' }} className="truncate">{tx.description}</p>
                  <p style={{ fontSize: 11, color: 'var(--ink-4)' }}>{formatDate(tx.transactionDate)}</p>
                </div>
                <span className={tx.type === 'INCOME' ? 'amount-income' : 'amount-expense'} style={{ fontSize: 13 }}>
                  {tx.type === 'INCOME' ? '+' : '−'}{formatCurrency(tx.amount, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Budget Overview ── */}
      {budgets.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>Budget Overview</h3>
            <Link to="/budgets" className="flex items-center gap-1"
                  style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>
              Manage <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {budgets.map(b => {
              const pct = Math.min(b.usagePercentage, 100);
              const barColor = pct >= 100 ? '#DC2626' : pct >= b.alertThreshold ? '#D97706' : 'var(--accent)';
              return (
                <div key={b.id} className="p-4 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: b.categoryColor ?? 'var(--accent)' }} />
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-1)' }}>{b.categoryName}</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: barColor }}>{pct.toFixed(0)}%</span>
                  </div>
                  <div className="progress-track" style={{ height: 6 }}>
                    <div className="progress-bar" style={{ height: 6, width: `${pct}%`, background: barColor }} />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{formatCurrency(b.spentAmount, currency)}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{formatCurrency(b.limitAmount, currency)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
