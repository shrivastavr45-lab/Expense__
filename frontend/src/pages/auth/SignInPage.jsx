import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
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
      const msg = err.response?.data?.message ?? '';
      toast.error(msg.includes('verify') ? 'Please verify your email first' : 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink-1)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>Sign in to your account to continue</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email address" type="email" placeholder="you@example.com"
          icon={Mail} value={form.email} onChange={set('email')} error={errors.email} />
        <div>
          <Input label="Password" type="password" placeholder="••••••••"
            icon={Lock} value={form.password} onChange={set('password')} error={errors.password} />
          <div className="flex justify-end mt-2">
            <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--accent-mid)', fontWeight: 500 }}
                  className="hover:underline">Forgot password?</Link>
          </div>
        </div>
        <Button type="submit" loading={loading} className="w-full btn-lg" style={{ marginTop: 8 }}>
          Sign in <ArrowRight size={15} />
        </Button>
      </form>
      <p className="text-center mt-6" style={{ fontSize: 13, color: 'var(--ink-4)' }}>
        No account?{' '}
        <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 500 }} className="hover:underline">
          Create one free
        </Link>
      </p>
    </>
  );
}
