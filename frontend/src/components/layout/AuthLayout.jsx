import { Outlet } from 'react-router-dom';
import { TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';

const features = [
  { icon: BarChart3, text: 'Real-time spending analytics' },
  { icon: Shield,    text: 'Bank-level security' },
  { icon: Zap,       text: 'Smart budget alerts' },
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--cream)' }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[420px] shrink-0"
           style={{ background: 'var(--accent)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl"
               style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.15)' }}>
            <TrendingUp size={20} color="#fff" />
          </div>
          <p style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>ExpenseTracker</p>
        </div>

        <div>
          <h1 style={{ color: '#fff', fontSize: 34, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Financial clarity you can trust.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, marginBottom: 40 }}>
            Track spending, set budgets, and understand your finances with confidence.
          </p>
          <div className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-lg"
                     style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }}>
                  <Icon size={16} color="rgba(255,255,255,0.9)" />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>© 2025 ExpenseTracker</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex items-center justify-center rounded-xl"
                 style={{ width: 34, height: 34, background: 'var(--accent)' }}>
              <TrendingUp size={17} color="#fff" />
            </div>
            <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink-1)' }}>ExpenseTracker</p>
          </div>
          <div className="card p-8 shadow-lg">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
