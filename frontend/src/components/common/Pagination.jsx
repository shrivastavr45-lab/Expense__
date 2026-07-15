import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, totalElements, size, onPageChange }) {
  if (totalPages <= 1) return null;
  const start = page * size + 1;
  const end   = Math.min((page + 1) * size, totalElements);

  return (
    <div className="flex items-center justify-between pt-1">
      <p style={{ fontSize: 12, color: 'var(--ink-4)' }}>
        Showing <span style={{ fontWeight: 500, color: 'var(--ink-2)' }}>{start}–{end}</span> of{' '}
        <span style={{ fontWeight: 500, color: 'var(--ink-2)' }}>{totalElements}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="btn btn-secondary btn-icon btn-sm"
        >
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className="btn btn-sm"
              style={{
                width: 30, height: 30, padding: 0,
                background: p === page ? 'var(--accent)' : 'transparent',
                color: p === page ? '#fff' : 'var(--ink-3)',
                border: p === page ? 'none' : '1px solid transparent',
                fontWeight: p === page ? 500 : 400,
                fontSize: 12,
              }}
            >
              {p + 1}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="btn btn-secondary btn-icon btn-sm"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
