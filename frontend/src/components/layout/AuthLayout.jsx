import { Outlet } from 'react-router-dom';
import { TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';

const features = [
  { icon: BarChart3, text: 'Real-time spending analytics' },
  { icon: Shield,    text: 'Bank-level security' },
  { icon: Zap,       text: 'Smart budget alerts' },
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: 'var(--cream)' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="hidden lg:flex flex-col justify-between p-12 w-[460px] shrink-0 relative z-10"
           style={{
             background: 'linear-gradient(160deg, rgba(99,102,241,0.35) 0%, rgba(79,70,229,0.25) 40%, rgba(139,92,246,0.15) 100%)',
             backdropFilter: 'blur(24px)',
             borderRight: '1px solid rgba(255,255,255,0.08)',
           }}>
        <div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl"
                 style={{
                   width: 40, height: 40,
                   background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
                   backdropFilter: 'blur(8px)',
                   border: '1px solid rgba(255,255,255,0.1)',
                 }}>
              <TrendingUp size={20} color="#fff" />
            </div>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>ExpenseTracker</p>
          </div>

          <div className="mt-24">
            <h1 style={{
              color: '#fff', fontSize: 36, fontWeight: 700,
              lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 16,
            }}>
              Financial clarity
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #A5B4FC, #C4B5FD)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>you can trust.</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, marginBottom: 48, maxWidth: 320 }}>
              Track spending, set budgets, and understand your finances with confidence.
            </p>
            <div className="space-y-5">
              {features.map(({ icon: Icon, text }, i) => (
                <div key={text} className="flex items-center gap-3.5 group"
                     style={{ animation: `fadeIn 0.5s ${0.2 + i * 0.1}s both` }}>
                  <div className="flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                       style={{
                         width: 36, height: 36,
                         background: 'rgba(255,255,255,0.08)',
                         border: '1px solid rgba(255,255,255,0.06)',
                         flexShrink: 0,
                       }}>
                    <Icon size={16} color="rgba(255,255,255,0.8)" />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 450 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: '0.05em' }}>&copy; 2025 ExpenseTracker</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto relative z-10">
        <div className="w-full max-w-md" style={{ animation: 'fadeIn 0.6s 0.1s both' }}>
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="flex items-center justify-center rounded-xl"
                 style={{ width: 34, height: 34, background: 'var(--accent)' }}>
              <TrendingUp size={17} color="#fff" />
            </div>
            <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink-1)' }}>ExpenseTracker</p>
          </div>
          <div className="card-premium">
            <Outlet />
          </div>
          <p className="text-center mt-8 lg:hidden" style={{ fontSize: 11, color: 'var(--ink-5)' }}>
            &copy; 2025 ExpenseTracker
          </p>
        </div>
      </div>
    </div>
  );
}
