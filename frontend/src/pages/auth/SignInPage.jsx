import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const { login }             = useAuthStore();
  const navigate              = useNavigate();
  const location              = useLocation();
  const from                  = location.state?.from?.pathname ?? '/dashboard';

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: '' })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.email)    err.email    = 'Email required';
    if (!form.password) err.password = 'Password required';
    if (Object.keys(err).length) { setErrors(err); return; }
    setLoading(true);
    try {
      const { data } = await authApi.signIn(form);
      login(data);
      toast.success(`Welcome back, ${data.username}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const message =
        status === 401 ? 'Invalid email or password'
        : status === 429  ? 'Too many attempts, try again later'
        : err.response?.data?.message || (status ? `Request failed (${status})` : 'Network error — check your connection or CORS setup');
      toast.error(message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-form">
      <div className="auth-header">
        <div className="auth-badge">Secure login</div>
        <h1>Welcome back</h1>
        <p>Sign in to your account to continue</p>
      </div>
      <form onSubmit={handleSubmit}>
        <Input label="Email address" type="email" placeholder="you@example.com"
          icon={Mail} value={form.email} onChange={set('email')} error={errors.email} />
        <div className="relative">
          <Input label="Password" type={showPw ? 'text' : 'password'} placeholder="Enter your password"
            icon={Lock} value={form.password} onChange={set('password')} error={errors.password} />
          <button type="button" onClick={() => setShowPw(p => !p)}
            className="absolute right-3.5 top-[34px]" style={{ color: 'var(--ink-4)', padding: 4 }}>
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <Button type="submit" loading={loading} className="w-full btn-lg" style={{ marginTop: 6 }}>
          Sign in <ArrowRight size={15} />
        </Button>
      </form>
      <div className="auth-divider">
        <span>New to ExpenseTracker?</span>
      </div>
      <Link to="/signup" className="auth-link">
        Create your account
      </Link>
    </div>
  );
}
