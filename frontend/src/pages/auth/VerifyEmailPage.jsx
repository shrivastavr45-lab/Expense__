import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import Spinner from '../../components/common/Spinner';
import { CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const [params]  = useSearchParams();
  const [status, setStatus] = useState('loading');
  const token     = params.get('token');

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    authApi.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  if (status === 'loading') return (
    <div className="flex flex-col items-center gap-4 py-8">
      <Spinner size="lg" />
      <p style={{ fontSize: 14, color: 'var(--ink-4)' }}>Verifying your email…</p>
    </div>
  );

  if (status === 'success') return (
    <div className="text-center py-4">
      <div className="flex items-center justify-center rounded-full mx-auto mb-5"
           style={{ width: 60, height: 60, background: '#DCFCE7' }}>
        <CheckCircle size={30} color="#15803D" />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-1)', marginBottom: 8 }}>Email verified!</h2>
      <p style={{ fontSize: 13, color: 'var(--ink-4)', marginBottom: 24 }}>Your account is active. You can now sign in.</p>
      <Link to="/signin" className="btn btn-primary btn-lg">Go to sign in</Link>
    </div>
  );

  return (
    <div className="text-center py-4">
      <div className="flex items-center justify-center rounded-full mx-auto mb-5"
           style={{ width: 60, height: 60, background: '#FEE2E2' }}>
        <XCircle size={30} color="#B91C1C" />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-1)', marginBottom: 8 }}>Verification failed</h2>
      <p style={{ fontSize: 13, color: 'var(--ink-4)', marginBottom: 24 }}>The link is invalid or has expired.</p>
      <Link to="/signin" className="btn btn-secondary">Back to sign in</Link>
    </div>
  );
}
