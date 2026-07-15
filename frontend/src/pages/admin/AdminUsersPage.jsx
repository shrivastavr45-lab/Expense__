import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api/adminApi';
import { useDebounce } from '../../hooks/useDebounce';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatters';
import { Search, UserCheck, UserX, Shield, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [pages, setPages]   = useState(0);
  const [page, setPage]     = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoad]  = useState(true);
  const debounced           = useDebounce(search, 400);

  const load = useCallback(() => {
    setLoad(true);
    adminApi.getUsers({ page, size: 20, search: debounced || undefined })
      .then(r => { setUsers(r.data.content); setTotal(r.data.totalElements); setPages(r.data.totalPages); })
      .finally(() => setLoad(false));
  }, [page, debounced]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (id, enabled) => {
    try { await adminApi.toggleUser(id); toast.success(enabled ? 'User disabled' : 'User enabled'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>
          <span style={{ fontWeight: 600, color: 'var(--ink-1)' }}>{total}</span> total users
        </p>
        <div className="relative">
          <span className="input-icon"><Search size={14} /></span>
          <input className="input-field has-icon" style={{ width: 260 }} placeholder="Search users…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-lg" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center rounded-full"
                             style={{ width: 34, height: 34, background: 'var(--accent-light)', fontSize: 12, fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>
                          {(((u.firstName?.[0] ?? '') + (u.lastName?.[0] ?? '')) || (u.username?.[0] ?? '?')).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: 500, color: 'var(--ink-1)', fontSize: 13 }}>
                            {u.firstName ? `${u.firstName} ${u.lastName ?? ''}`.trim() : u.username}
                          </p>
                          <p style={{ fontSize: 11, color: 'var(--ink-4)' }}>@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--ink-3)' }}>{u.email}</td>
                    <td>
                      <div className="flex gap-1.5 flex-wrap">
                        {u.roles?.map(r => (
                          <span key={r} className={`badge ${r.includes('ADMIN') ? 'badge-accent' : 'badge-neutral'}`}>
                            {r.includes('ADMIN') && <Shield size={9} />}
                            {r.replace('ROLE_', '').toLowerCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.enabled ? 'badge-income' : 'badge-expense'}`}>
                        {u.enabled ? <UserCheck size={10} /> : <UserX size={10} />}
                        {u.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--ink-4)' }}>{formatDate(u.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => handleToggle(u.id, u.enabled)}
                        className="btn btn-sm"
                        style={u.enabled
                          ? { color: 'var(--expense)', background: 'rgba(244, 63, 94, 0.15)', border: 'none' }
                          : { color: 'var(--income)', background: 'rgba(16, 185, 129, 0.15)', border: 'none' }
                        }>
                        {u.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <Pagination page={page} totalPages={pages} totalElements={total} size={20} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
