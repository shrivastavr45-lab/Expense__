import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import AppLayout   from './components/layout/AppLayout';
import AuthLayout  from './components/layout/AuthLayout';

// Guards
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute     from './routes/AdminRoute';

// Auth pages
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';

// App pages
import DashboardPage    from './pages/dashboard/DashboardPage';
import TransactionsPage from './pages/transactions/TransactionsPage';
import BudgetsPage      from './pages/budgets/BudgetsPage';
import AnalyticsPage    from './pages/analytics/AnalyticsPage';
import RecurringPage    from './pages/recurring/RecurringPage';
import ProfilePage      from './pages/profile/ProfilePage';

// Admin pages
import AdminUsersPage        from './pages/admin/AdminUsersPage';
import AdminAuditPage        from './pages/admin/AdminAuditPage';
import AdminTransactionsPage from './pages/admin/AdminTransactionsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '12px', fontSize: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
        }}
      />
      <Routes>
        {/* Public auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        {/* Protected app routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard"    element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/budgets"      element={<BudgetsPage />} />
            <Route path="/analytics"    element={<AnalyticsPage />} />
            <Route path="/recurring"    element={<RecurringPage />} />
            <Route path="/profile"      element={<ProfilePage />} />

            {/* Admin-only routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/users"        element={<AdminUsersPage />} />
              <Route path="/admin/audit"        element={<AdminAuditPage />} />
              <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
