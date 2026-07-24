import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api/authApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const [form, setForm] = useState({ username:'', email:'', password:'', firstName:'', lastName:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
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
      toast.success('Account created! You can now sign in.');
      navigate('/signin');
    } catch (err) { toast.error(err.response?.data?.message ?? 'Sign up failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-form">
      <div className="auth-header">
        <h1>Create your account</h1>
        <p>Start tracking your finances today</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" placeholder="John" value={form.firstName} onChange={set('firstName')} />
          <Input label="Last name"  placeholder="Doe"  value={form.lastName}  onChange={set('lastName')}  />
        </div>
        <Input label="Username" placeholder="johndoe" icon={User}
          value={form.username} onChange={set('username')} error={errors.username} />
        <Input label="Email address" type="email" placeholder="you@example.com" icon={Mail}
          value={form.email} onChange={set('email')} error={errors.email} />
        <div className="relative">
          <Input label="Password" type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" icon={Lock}
            value={form.password} onChange={set('password')} error={errors.password} />
          <button type="button" onClick={() => setShowPw(p => !p)}
            className="absolute right-3.5 top-[34px]" style={{ color: 'var(--ink-4)', padding: 4 }}>
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <Button type="submit" loading={loading} className="w-full btn-lg" style={{ marginTop: 6 }}>
          Create account <ArrowRight size={15} />
        </Button>
      </form>
      <div className="auth-divider">
        <span>Already have an account?</span>
      </div>
      <Link to="/signin" className="auth-link">
        Sign in
      </Link>
    </div>
  );
}
