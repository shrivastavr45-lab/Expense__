export default function Input({ label, error, icon: Icon, className = '', inputClassName = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrap">
        {Icon && <span className="input-icon"><Icon size={15} /></span>}
        <input
          className={`input-field ${Icon ? 'has-icon' : ''} ${error ? 'input-error' : ''} ${inputClassName}`}
          {...props}
        />
      </div>
      {error && <p className="input-error-msg">{error}</p>}
    </div>
  );
}
