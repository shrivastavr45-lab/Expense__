import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export default function Modal({ open, onClose, title, children, size = 'md', description }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handle = (e) => e.key === 'Escape' && onClose();
    if (open) {
      document.addEventListener('keydown', handle);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handle);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-backdrop animate-fade-in"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className={`relative w-full ${sizes[size]} rounded-t-3xl sm:rounded-2xl shadow-xl animate-slide-up max-h-[92vh] flex flex-col`}
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 shrink-0"
             style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-1)', margin: 0 }}>{title}</h2>
            {description && <p style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }}>{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-icon btn-sm ml-3"
            style={{ color: 'var(--ink-4)' }}
          >
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
      </div>
    </div>
  );
}
