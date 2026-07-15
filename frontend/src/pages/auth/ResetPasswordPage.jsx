import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { authApi } from '../../api/authApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const [password, setPass] = useState('');
  const [loading, setLoad]  = useState(false);
  const navigate = useNavigate();
  const token = params.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Min 8 characters'); return; }
    if (!token) { toast.error('Invalid reset link'); return; }
    setLoad(true);
    try {
      await authApi.resetPassword({ token, newPassword: password });
      toast.success('Password reset! Sign in now.');
      navigate('/signin');
    } catch (err) { toast.error(err.response?.data?.message ?? 'Reset failed'); }
    finally { setLoad(false); }
  };

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink-1)', letterSpacing: '-0.02em', marginBottom: 6 }}>Set new password</h1>
        <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>Choose a strong password of at least 8 characters.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="New password" type="password" placeholder="Min 8 characters" icon={Lock}
          value={password} onChange={e => setPass(e.target.value)} />
        <Button type="submit" loading={loading} className="w-full btn-lg">Reset password</Button>
      </form>
      <p className="text-center mt-6" style={{ fontSize: 13, color: 'var(--ink-4)' }}>
        <Link to="/signin" style={{ color: 'var(--accent)', fontWeight: 500 }} className="hover:underline">Back to sign in</Link>
      </p>
    </>
  );
}
