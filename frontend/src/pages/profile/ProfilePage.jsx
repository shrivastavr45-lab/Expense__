import { useState, useEffect } from 'react';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { CURRENCIES } from '../../utils/constants';
import { User, Lock, Shield, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Section = ({ title, description, icon: Icon, iconAccent = 'accent', children }) => {
  const accents = { accent: { bg: 'var(--accent-light)', color: 'var(--accent)' }, warn: { bg: '#FEF3C7', color: '#92400E' }, purple: { bg: '#EDE9FE', color: '#5B21B6' } };
  const { bg, color } = accents[iconAccent];
  return (
    <div className="card">
      <div className="flex items-center gap-4 p-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-center rounded-xl"
             style={{ width: 44, height: 44, background: bg, flexShrink: 0 }}>
          <Icon size={20} color={color} strokeWidth={1.8} />
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>{title}</p>
          <p style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 1 }}>{description}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState({ firstName: '', lastName: '', currency: 'INR' });
  const [pwForm, setPw]       = useState({ currentPassword: '', newPassword: '' });
  const [savingP, setSavP]    = useState(false);
  const [savingW, setSavW]    = useState(false);

  useEffect(() => {
    if (user) setProfile({ firstName: user.firstName ?? '', lastName: user.lastName ?? '', currency: user.currency ?? 'INR' });
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavP(true);
    try {
      await authApi.updateProfile(profile);
      updateUser(profile);
      toast.success('Profile updated');
    } catch { toast.error('Update failed'); }
    finally { setSavP(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 8) { toast.error('New password needs 8+ chars'); return; }
    setSavW(true);
    try {
      await authApi.changePassword(pwForm);
      toast.success('Password changed');
      setPw({ currentPassword: '', newPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message ?? 'Failed'); }
    finally { setSavW(false); }
  };

  const initials = ((((user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')) || (user?.username?.[0] ?? '?'))).toUpperCase();

  return (
    <div className="max-w-2xl space-y-5 animate-fade-in">
      {/* Avatar row */}
      <div className="card p-6 flex items-center gap-5">
        <div className="flex items-center justify-center rounded-2xl font-number"
             style={{ width: 64, height: 64, background: 'var(--accent)', color: '#fff', fontSize: 22, fontWeight: 700, flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink-1)' }}>
            {profile.firstName ? `${profile.firstName} ${profile.lastName}`.trim() : user?.username}
          </p>
          <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>@{user?.username} · {user?.email}</p>
          <div className="flex items-center gap-3 mt-2">
            {user?.roles?.map(r => (
              <span key={r} className="badge badge-accent" style={{ fontSize: 10 }}>
                {r.replace('ROLE_', '').toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Personal info */}
      <Section title="Personal information" description="Update your display name and currency" icon={User}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
              <p style={{ fontSize: 11, color: 'var(--ink-4)', marginBottom: 2 }}>Username</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }}>@{user?.username}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
              <p style={{ fontSize: 11, color: 'var(--ink-4)', marginBottom: 2 }}>Email</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }} className="truncate">{user?.email}</p>
            </div>
          </div>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="First name" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
              <Input label="Last name"  value={profile.lastName}  onChange={e => setProfile(p => ({ ...p, lastName:  e.target.value }))} />
            </div>
            <Select label="Currency" value={profile.currency} onChange={e => setProfile(p => ({ ...p, currency: e.target.value }))}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Button type="submit" loading={savingP} size="sm">Save changes</Button>
          </form>
        </div>
      </Section>

      {/* Password */}
      <Section title="Change password" description="Use a strong password of at least 8 characters" icon={Lock} iconAccent="warn">
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <Input label="Current password" type="password" value={pwForm.currentPassword}
            onChange={e => setPw(p => ({ ...p, currentPassword: e.target.value }))} />
          <Input label="New password" type="password" placeholder="Min 8 characters" value={pwForm.newPassword}
            onChange={e => setPw(p => ({ ...p, newPassword: e.target.value }))} />
          <Button type="submit" loading={savingW} size="sm">Change password</Button>
        </form>
      </Section>

      {/* Account status */}
      <Section title="Account status" description="Verification and access details" icon={Shield} iconAccent="purple">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Email verified', ok: user?.emailVerified },
            { label: 'Account active', ok: user?.enabled },
          ].map(({ label, ok }) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-lg"
                 style={{ background: 'var(--surface-2)' }}>
              <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{label}</span>
              <span className="flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 500, color: ok ? 'var(--income)' : 'var(--expense)' }}>
                {ok ? <CheckCircle size={13} /> : <XCircle size={13} />}
                {ok ? 'Yes' : 'No'}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
