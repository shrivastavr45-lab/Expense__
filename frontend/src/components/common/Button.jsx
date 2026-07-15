import { forwardRef } from 'react';
import Spinner from './Spinner';

const Button = forwardRef(({
  children, loading, variant = 'primary', size = 'md',
  icon: Icon, className = '', ...props
}, ref) => {
  const variantClass = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    ghost:     'btn-ghost',
    danger:    'btn-danger',
  }[variant] ?? 'btn-primary';

  const sizeClass = {
    sm:   'btn-sm',
    md:   '',
    lg:   'btn-lg',
    icon: 'btn-icon',
  }[size] ?? '';

  const classes = ['btn', variantClass, sizeClass, className].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={classes}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading
        ? <Spinner size="sm" color={variant === 'primary' ? 'light' : 'dark'} />
        : Icon && <Icon size={size === 'sm' ? 13 : 15} />
      }
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
