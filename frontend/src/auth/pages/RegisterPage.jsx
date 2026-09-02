import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Building2 } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { Field, TextInput, PasswordInput, SubmitButton, Alert } from '../components/FormControls';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';
import { validateEmail, validateName, validatePassword } from '../utils/validation';

const roleOptions = [
  { value: ROLES.USER, label: 'Player', text: 'Book courts & join matches', icon: User },
  { value: ROLES.OWNER, label: 'Facility Owner', text: 'List & manage venues', icon: Building2 }
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: ROLES.USER });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm: form.confirm === form.password ? '' : 'Passwords do not match'
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    setServerError('');
    try {
      const email = form.email.trim();
      await register({ name: form.name.trim(), email, password: form.password, role: form.role });
      navigate('/verify-otp', { state: { email, notice: `We sent a 6-digit code to ${email}.` } });
    } catch (err) {
      if (err.status === 409) {
        setErrors((er) => ({ ...er, email: err.message }));
      } else {
        setServerError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join QuickCourt as a player or a facility owner."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-700 hover:text-emerald-800">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert>{serverError}</Alert>

        <div>
          <span className="block text-xs font-bold text-slate-700 mb-1.5">I want to</span>
          <div className="grid grid-cols-2 gap-3">
            {roleOptions.map(({ value, label, text, icon: Icon }) => {
              const active = form.role === value;
              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => setForm((f) => ({ ...f, role: value }))}
                  className={`text-left rounded-xl border p-3 transition ${
                    active
                      ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100'
                      : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-2 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div className={`text-sm font-bold ${active ? 'text-emerald-800' : 'text-slate-800'}`}>{label}</div>
                  <div className="text-[11px] text-slate-500">{text}</div>
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Full name" error={errors.name}>
          <TextInput placeholder="Your name" autoComplete="name" value={form.name} onChange={update('name')} invalid={Boolean(errors.name)} />
        </Field>

        <Field label="Email address" error={errors.email}>
          <TextInput type="email" placeholder="you@example.com" autoComplete="email" value={form.email} onChange={update('email')} invalid={Boolean(errors.email)} />
        </Field>

        <Field label="Password" error={errors.password} hint="At least 8 characters with a letter and a number.">
          <PasswordInput placeholder="Create a password" autoComplete="new-password" value={form.password} onChange={update('password')} invalid={Boolean(errors.password)} />
        </Field>

        <Field label="Confirm password" error={errors.confirm}>
          <PasswordInput placeholder="Repeat your password" autoComplete="new-password" value={form.confirm} onChange={update('confirm')} invalid={Boolean(errors.confirm)} />
        </Field>

        <SubmitButton loading={loading}>{loading ? 'Creating account...' : 'Create account'}</SubmitButton>
      </form>
    </AuthLayout>
  );
}
