import { Menu, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Topbar({ onMenuClick, title }) {
  const { user } = useAuthStore();
  return (
    <header className="flex items-center gap-4 px-5 lg:px-7 py-4"
            style={{ background: 'rgba(20, 22, 31, 0.4)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)', height: 64, position: 'sticky', top: 0, zIndex: 10 }}>
      <button
        onClick={onMenuClick}
        className="lg:hidden btn btn-ghost btn-icon"
        style={{ color: 'var(--ink-3)' }}
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 flex items-center gap-3">
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-1)', margin: 0, lineHeight: 1 }}>{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn btn-ghost btn-icon relative" style={{ color: 'var(--ink-3)' }}>
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                style={{ background: '#DC2626' }} />
        </button>
        <div className="flex items-center justify-center rounded-full ml-1"
             style={{ width: 32, height: 32, background: 'var(--accent-light)', fontSize: 12, fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>
          {(user?.firstName?.[0] || user?.username?.[0] || '?').toUpperCase()}
        </div>
      </div>
    </header>
  );
}
