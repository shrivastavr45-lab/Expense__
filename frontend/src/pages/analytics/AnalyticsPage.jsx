import { useEffect, useState } from 'react';
import { analyticsApi } from '../../api/analyticsApi';
import { useAuthStore } from '../../store/authStore';
import StatCard from '../../components/common/StatCard';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart
} from 'recharts';

const PALETTE = ['#1A3C34','#2D6A5A','#3D8B7A','#22C55E','#F59E0B','#EF4444','#8B5CF6','#3B82F6','#EC4899','#14B8A6'];

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 shadow-lg" style={{ minWidth: 150, border: '1px solid var(--border)' }}>
      <p style={{ fontSize: 11, color: 'var(--ink-4)', marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.stroke || p.fill, display: 'inline-block' }} />
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

export default function AnalyticsPage() {
  const { user }  = useAuthStore();
  const currency  = user?.currency ?? 'INR';
  const [data, setData]   = useState(null);
  const [loading, setLoad] = useState(true);
  const [range, setRange]  = useState('12months');

  useEffect(() => {
    setLoad(true);
    const call = range === 'current'
      ? analyticsApi.getCurrentMonth()
      : analyticsApi.getLast12Months();
    call.then(r => setData(r.data)).finally(() => setLoad(false));
  }, [range]);

  const monthly  = data?.monthlyData ?? [];
  const cats     = data?.categoryBreakdown ?? [];

  const chartData = monthly.map(m => ({
    name:     m.monthLabel,
    Income:   Number(m.income   ?? 0),
    Expenses: Number(m.expenses ?? 0),
    Net:      Number((m.income ?? 0)) - Number((m.expenses ?? 0)),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Range Selector */}
      <div className="flex items-center gap-2">
        {[['current','This month'],['12months','Last 12 months']].map(([v, l]) => (
          <button key={v} onClick={() => setRange(v)}
            className="btn btn-sm"
            style={range === v
              ? { background: 'var(--accent)', color: '#fff', border: 'none' }
              : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink-3)' }
            }>
            {l}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Income"   value={formatCurrency(data?.totalIncome   ?? 0, currency)} icon={TrendingUp}   accent="income"  />
        <StatCard title="Total Expenses" value={formatCurrency(data?.totalExpenses ?? 0, currency)} icon={TrendingDown} accent="expense" />
        <StatCard title="Net Balance"    value={formatCurrency(data?.netBalance    ?? 0, currency)} icon={Wallet}
          accent={(data?.netBalance ?? 0) >= 0 ? 'accent' : 'expense'} />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar Chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>Income vs Expenses</h3>
              <p style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }}>Monthly comparison</p>
            </div>
            <div className="flex items-center gap-4">
              {[['Income','var(--accent)'],['Expenses','var(--expense)']].map(([n,c]) => (
                <span key={n} className="flex items-center gap-1.5" style={{ fontSize: 11, color: 'var(--ink-4)' }}>
                  <span style={{ width: 8, height: 8, background: c, borderRadius: 2, display: 'inline-block', opacity: n === 'Expenses' ? 0.7 : 1 }} />{n}
                </span>
              ))}
            </div>
          </div>
          {monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink-4)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--ink-4)' }} tickLine={false} axisLine={false}
                  tickFormatter={v => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} width={45} />
                <Tooltip content={<CustomTooltip currency={currency} />} cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 4 }} />
                <Bar dataKey="Income"   fill="var(--accent)" radius={[4,4,0,0]} />
                <Bar dataKey="Expenses" fill="var(--expense)" fillOpacity={0.7} radius={[4,4,0,0]} />
              </BarChart>
          </ResponsiveContainer>
        ) : null}
        </div>

        {/* Pie Chart */}
        <div className="card p-6">
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)', marginBottom: 4 }}>Expense Breakdown</h3>
          <p style={{ fontSize: 12, color: 'var(--ink-4)', marginBottom: 20 }}>By category</p>
          {cats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <BarChart3 size={28} color="var(--ink-5)" />
              <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>No expense data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={cats} dataKey="amount" nameKey="category" cx="50%" cy="45%"
                     outerRadius={80} innerRadius={48} paddingAngle={2}>
                  {cats.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Pie>
                <Tooltip formatter={v => formatCurrency(v, currency)}
                  contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12 }} />
                <Legend iconSize={7} iconType="circle"
                  formatter={(v, e) => `${v.length > 12 ? v.slice(0,12)+'…' : v} ${e.payload.percentage.toFixed(0)}%`}
                  wrapperStyle={{ fontSize: 11, color: 'var(--ink-3)' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Net Balance Trend */}
      {chartData.length > 1 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>Net Balance Trend</h3>
              <p style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }}>Running savings over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink-4)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--ink-4)' }} tickLine={false} axisLine={false}
                  tickFormatter={v => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} width={45} />
              <Tooltip content={<CustomTooltip currency={currency} />} cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="Net" stroke="var(--accent)" strokeWidth={2}
                fill="url(#netGrad)" dot={{ fill: 'var(--accent)', r: 3 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Table */}
      {cats.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>Category Breakdown</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(226,221,214,.5)' }}>
            {cats.map((c, i) => (
              <div key={c.category} className="flex items-center gap-4 px-6 py-3.5 transition-colors" onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: PALETTE[i % PALETTE.length], flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-1)', marginBottom: 4 }}>{c.category}</p>
                  <div className="progress-track h-1.5" style={{ maxWidth: 300 }}>
                    <div className="progress-bar h-1.5" style={{ width: `${c.percentage}%`, background: PALETTE[i % PALETTE.length] }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p className="font-number" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>{formatCurrency(c.amount, currency)}</p>
                  <p style={{ fontSize: 11, color: 'var(--ink-4)' }}>{formatPercent(c.percentage)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
