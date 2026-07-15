export default function Spinner({ size = 'md', color = 'dark' }) {
  const sz = { sm: 14, md: 20, lg: 32 }[size];
  const c  = color === 'light' ? 'rgba(255,255,255,.35)' : 'rgba(26,60,52,.15)';
  const cb = color === 'light' ? '#fff' : 'var(--accent)';
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" style={{ animation: 'spin 0.75s linear infinite', flexShrink: 0 }}>
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
      <circle cx="12" cy="12" r="9" fill="none" stroke={c} strokeWidth="2.5" />
      <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke={cb} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
