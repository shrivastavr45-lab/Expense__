export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {Icon && (
        <div className="flex items-center justify-center rounded-2xl mb-5"
             style={{ width: 64, height: 64, background: 'var(--accent-light)' }}>
          <Icon size={28} color="var(--accent)" strokeWidth={1.5} />
        </div>
      )}
      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-1)', marginBottom: 6 }}>{title}</p>
      {description && (
        <p style={{ fontSize: 13, color: 'var(--ink-4)', maxWidth: 320, lineHeight: 1.6 }}>{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
