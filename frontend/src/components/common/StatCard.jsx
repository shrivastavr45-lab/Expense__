import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, accent = 'accent', trend, trendValue }) {
  const accents = {
    accent:  { bg: 'var(--accent-light)', color: 'var(--accent)',  text: 'var(--accent)' },
    income:  { bg: '#DCFCE7',             color: '#15803D',        text: '#15803D' },
    expense: { bg: '#FEE2E2',             color: '#B91C1C',        text: '#B91C1C' },
    warn:    { bg: '#FEF3C7',             color: '#92400E',        text: '#D97706' },
    purple:  { bg: '#EDE9FE',             color: '#5B21B6',        text: '#6D28D9' },
  };
  const { bg, color } = accents[accent] || accents.accent;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? '#15803D' : trend === 'down' ? '#B91C1C' : 'var(--ink-4)';

  return (
    <div className="card card-hover p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            {title}
          </p>
          <p className="font-number" style={{ fontSize: 26, fontWeight: 600, color: 'var(--ink-1)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            {value}
          </p>
          {subtitle && (
            <p style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 4 }}>{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="flex items-center justify-center rounded-xl shrink-0"
               style={{ width: 44, height: 44, background: bg }}>
            <Icon size={20} color={color} strokeWidth={1.8} />
          </div>
        )}
      </div>
      {trendValue !== undefined && (
        <div className="flex items-center gap-1.5 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
          <TrendIcon size={13} color={trendColor} />
          <span style={{ fontSize: 11, color: trendColor, fontWeight: 500 }}>{trendValue}</span>
          <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>vs last month</span>
        </div>
      )}
    </div>
  );
}
