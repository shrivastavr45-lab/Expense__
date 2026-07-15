import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, Target, PieChart,
  RefreshCw, User, Shield, LogOut, TrendingUp,
  ChevronRight, FileText, X, Users
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/transactions', icon: ArrowLeftRight,  label: 'Transactions'},
  { to: '/budgets',      icon: Target,          label: 'Budgets'     },
  { to: '/analytics',    icon: PieChart,        label: 'Analytics'   },
  { to: '/recurring',    icon: RefreshCw,       label: 'Recurring'   },
  { to: '/profile',      icon: User,            label: 'Profile'     },
];

const ADMIN = [
  { to: '/admin/users',        icon: Users,          label: 'Users'         },
  { to: '/admin/transactions', icon: ArrowLeftRight, label: 'All Transactions'},
  { to: '/admin/audit',        icon: FileText,       label: 'Audit Logs'    },
];

export default function Sidebar({ open, onClose }) {
  const user   = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;
  const navigate = useNavigate();

  const name = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.username;
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/signin');
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-20 lg:hidden modal-backdrop" onClick={onClose} />
      )}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          transition-transform duration-300 lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:z-auto
        `}
        style={{
          width: 240,
          background: 'rgba(15, 17, 26, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center rounded-xl"
                 style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.15)' }}>
              <TrendingUp size={17} color="#fff" strokeWidth={2.2} />
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: 14, lineHeight: 1 }}>ExpenseTracker</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, marginTop: 2 }}>Finance Manager</p>
            </div>
          </div>
          <button className="lg:hidden flex items-center justify-center rounded-lg"
                  style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.1)' }}
                  onClick={onClose}>
            <X size={14} color="rgba(255,255,255,0.7)" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-0.5">
          <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '8px 10px 4px' }}>
            Main
          </p>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-white/15 text-white font-medium shadow-sm'
                    : 'text-white/60 hover:bg-white/10 hover:text-white/90'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {isActive && <ChevronRight size={13} style={{ opacity: 0.5 }} />}
                </>
              )}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '16px 10px 4px' }}>
                Admin
              </p>
              {ADMIN.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-white/15 text-white font-medium'
                        : 'text-white/60 hover:bg-white/10 hover:text-white/90'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User card + logout */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
               style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-center rounded-full shrink-0"
                 style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)', fontSize: 12, fontWeight: 600, color: '#fff' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: '#fff', fontWeight: 500, fontSize: 13, lineHeight: 1.2 }} className="truncate">{name}</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }} className="truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: 'rgba(255,255,255,0.5)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
