import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api/adminApi';
import Pagination from '../../components/common/Pagination';
import { format } from 'date-fns';

const ACTION_STYLES = {
  CREATE:         { bg: '#DCFCE7', color: '#15803D' },
  UPDATE:         { bg: '#DBEAFE', color: '#1E40AF' },
  DELETE:         { bg: '#FEE2E2', color: '#B91C1C' },
  LOGIN:          { bg: '#EDE9FE', color: '#5B21B6' },
  SIGNUP:         { bg: '#DBEAFE', color: '#1E40AF' },
  EMAIL_VERIFIED: { bg: '#D1FAE5', color: '#065F46' },
  PASSWORD_RESET: { bg: '#FEF3C7', color: '#92400E' },
  LOGOUT:         { bg: 'var(--surface-2)', color: 'var(--ink-3)' },
};

export default function AdminAuditPage() {
  const [logs, setLogs]     = useState([]);
  const [total, setTotal]   = useState(0);
  const [pages, setPages]   = useState(0);
  const [page, setPage]     = useState(0);
  const [action, setAction] = useState('');
  const [entity, setEntity] = useState('');
  const [loading, setLoad]  = useState(true);

  const load = useCallback(() => {
    setLoad(true);
    adminApi.getAuditLogs({ page, size: 50, action: action||undefined, entityType: entity||undefined })
      .then(r => { setLogs(r.data.content); setTotal(r.data.totalElements); setPages(r.data.totalPages); })
      .finally(() => setLoad(false));
  }, [page, action, entity]);

  useEffect(() => { load(); }, [load]);

  const actions = ['CREATE','UPDATE','DELETE','LOGIN','LOGOUT','SIGNUP','EMAIL_VERIFIED','PASSWORD_RESET'];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>
          <span style={{ fontWeight: 600, color: 'var(--ink-1)' }}>{total}</span> audit entries
        </p>
        <div className="flex gap-3">
          <select className="input-field" style={{ width: 180 }} value={action} onChange={e => { setAction(e.target.value); setPage(0); }}>
            <option value="">All actions</option>
            {actions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select className="input-field" style={{ width: 180 }} value={entity} onChange={e => { setEntity(e.target.value); setPage(0); }}>
            <option value="">All entities</option>
            {['USER','TRANSACTION','BUDGET','RECURRING_EXPENSE'].map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => {
                  const style = ACTION_STYLES[log.action] ?? ACTION_STYLES.LOGOUT;
                  return (
                    <tr key={log.id}>
                      <td style={{ fontSize: 11, color: 'var(--ink-4)', whiteSpace: 'nowrap' }}>
                        {log.createdAt ? format(new Date(log.createdAt), 'MMM d, HH:mm') : '—'}
                      </td>
                      <td>
                        <p style={{ fontSize: 12, color: 'var(--ink-1)', fontWeight: 500 }}>{log.userEmail ?? '—'}</p>
                      </td>
                      <td>
                        <span className="badge" style={{ background: style.bg, color: style.color, fontSize: 10 }}>
                          {log.action}
                        </span>
                      </td>
                      <td>
                        {log.entityType && (
                          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                            {log.entityType}{log.entityId && <span style={{ color: 'var(--ink-5)' }}> #{String(log.entityId).slice(-6)}</span>}
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: 11, color: 'var(--ink-4)', fontFamily: 'monospace' }}>{log.ipAddress ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <Pagination page={page} totalPages={pages} totalElements={total} size={50} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
