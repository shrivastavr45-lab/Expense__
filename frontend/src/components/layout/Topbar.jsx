import { Menu, Bell, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Topbar({ onMenuClick, title }) {
  const { user } = useAuthStore();
  return (
    <header className="flex items-center gap-4 px-5 lg:px-7 py-4"
            style={{
              background: 'rgba(20, 22, 31, 0.45)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              height: 64,
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}>
      <button
        onClick={onMenuClick}
        className="lg:hidden btn btn-ghost btn-icon"
        style={{ color: 'var(--ink-3)' }}
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 flex items-center gap-4">
        <h1 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-1)', letterSpacing: '-0.02em' }}>{title}</h1>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg ml-4"
             style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Search size={13} color="var(--ink-5)" />
          <span style={{ fontSize: 12, color: 'var(--ink-5)' }}>Search...</span>
          <span style={{ fontSize: 10, color: 'var(--ink-5)', background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 4, marginLeft: 20 }}>⌘K</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn btn-ghost btn-icon relative" style={{ color: 'var(--ink-4)' }}>
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full"
                style={{ background: '#DC2626', boxShadow: '0 0 6px rgba(220,38,38,0.5)' }} />
        </button>
        <div className="flex items-center justify-center rounded-full ml-2"
             style={{
               width: 32, height: 32,
               background: 'linear-gradient(135deg, var(--accent), var(--accent-mid))',
               fontSize: 12, fontWeight: 600, color: '#fff',
               flexShrink: 0,
               boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
             }}>
          {(user?.firstName?.[0] || user?.username?.[0] || '?').toUpperCase()}
        </div>
      </div>
    </header>
  );
}
