import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';

const TITLES = {
  '/dashboard':          'Dashboard',
  '/transactions':       'Transactions',
  '/budgets':            'Budgets',
  '/analytics':          'Analytics',
  '/recurring':          'Recurring Expenses',
  '/profile':            'Profile Settings',
  '/admin/users':        'Manage Users',
  '/admin/audit':        'Audit Logs',
  '/admin/transactions': 'All Transactions',
};

export default function AppLayout() {
  const [sidebarOpen, setSidebar] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'transparent' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebar(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebar(true)} title={TITLES[pathname] || 'Expense Tracker'} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          <div className="max-w-screen-xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
