export default function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="input-label">{label}</label>}
      <select className={`input-field ${error ? 'input-error' : ''}`} {...props}>
        {children}
      </select>
      {error && <p className="input-error-msg">{error}</p>}
    </div>
  );
}
