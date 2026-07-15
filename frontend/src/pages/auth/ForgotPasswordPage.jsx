import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import { authApi } from '../../api/authApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoad] = useState(false);
  const [sent, setSent]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email'); return; }
    setLoad(true);
    try { await authApi.forgotPassword({ email }); setSent(true); }
    catch { toast.error('Something went wrong'); }
    finally { setLoad(false); }
  };

  if (sent) return (
    <div className="text-center py-4">
      <div className="flex items-center justify-center rounded-full mx-auto mb-5"
           style={{ width: 56, height: 56, background: '#DCFCE7' }}>
        <CheckCircle size={26} color="#15803D" />
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink-1)', marginBottom: 8 }}>Check your inbox</h2>
      <p style={{ fontSize: 13, color: 'var(--ink-4)', marginBottom: 24 }}>
        If <strong>{email}</strong> has an account, a reset link was sent.
      </p>
      <Link to="/signin" className="btn btn-secondary">Back to sign in</Link>
    </div>
  );

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink-1)', letterSpacing: '-0.02em', marginBottom: 6 }}>Forgot password?</h1>
        <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>Enter your email and we'll send a reset link.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email address" type="email" placeholder="you@example.com" icon={Mail}
          value={email} onChange={e => setEmail(e.target.value)} />
        <Button type="submit" loading={loading} className="w-full btn-lg">Send reset link</Button>
      </form>
      <p className="text-center mt-6" style={{ fontSize: 13, color: 'var(--ink-4)' }}>
        <Link to="/signin" style={{ color: 'var(--accent)', fontWeight: 500 }} className="hover:underline">Back to sign in</Link>
      </p>
    </>
  );
}
