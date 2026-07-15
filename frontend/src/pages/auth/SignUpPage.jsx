import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { authApi } from '../../api/authApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const [form, setForm] = useState({ username:'', email:'', password:'', firstName:'', lastName:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.username || form.username.length < 3) e.username = 'Min 3 characters';
    if (!form.email) e.email = 'Valid email required';
    if (!form.password || form.password.length < 8) e.password = 'Min 8 characters';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await authApi.signUp(form);
      toast.success('Account created! Check your email to verify.');
      navigate('/signin');
    } catch (err) { toast.error(err.response?.data?.message ?? 'Sign up failed'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink-1)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Create your account
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>Start tracking your finances today</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" placeholder="John" value={form.firstName} onChange={set('firstName')} />
          <Input label="Last name"  placeholder="Doe"  value={form.lastName}  onChange={set('lastName')}  />
        </div>
        <Input label="Username" placeholder="johndoe" icon={User}
          value={form.username} onChange={set('username')} error={errors.username} />
        <Input label="Email address" type="email" placeholder="you@example.com" icon={Mail}
          value={form.email} onChange={set('email')} error={errors.email} />
        <Input label="Password" type="password" placeholder="Min 8 characters" icon={Lock}
          value={form.password} onChange={set('password')} error={errors.password} />
        <Button type="submit" loading={loading} className="w-full btn-lg" style={{ marginTop: 8 }}>
          Create account <ArrowRight size={15} />
        </Button>
      </form>
      <p className="text-center mt-6" style={{ fontSize: 13, color: 'var(--ink-4)' }}>
        Already have an account?{' '}
        <Link to="/signin" style={{ color: 'var(--accent)', fontWeight: 500 }} className="hover:underline">Sign in</Link>
      </p>
    </>
  );
}
