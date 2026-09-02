import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { Field, TextInput, PasswordInput, SubmitButton, Alert } from '../components/FormControls';
import { useAuth } from '../context/AuthContext';
import { homeForRole } from '../utils/roles';
import { validateEmail } from '../utils/validation';

export default function LoginPage() {
  const { login, sessionMessage, clearSessionMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: location.state?.email || '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [notice] = useState(location.state?.notice || sessionMessage || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionMessage) clearSessionMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {
      email: validateEmail(form.email),
      password: form.password ? '' : 'Password is required'
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    setServerError('');
    try {
      const user = await login({ email: form.email.trim(), password: form.password });
      const from = location.state?.from;
      const home = homeForRole(user.role);
      const rolePrefix = `/${user.role.toLowerCase()}`;
      navigate(from && from.startsWith(rolePrefix) ? from : home, { replace: true });
    } catch (err) {
      if (err.code === 'ACCOUNT_NOT_VERIFIED') {
        navigate('/verify-otp', { state: { email: form.email.trim(), notice: err.message } });
        return;
      }
      setServerError(err.message || 'Unable to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage bookings, matches and facilities."
      footer={
        <>
          New to QuickCourt?{' '}
          <Link to="/register" className="font-bold text-emerald-700 hover:text-emerald-800">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert type="info">{notice}</Alert>
        <Alert>{serverError}</Alert>

        <Field label="Email address" error={errors.email}>
          <TextInput
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update('email')}
            invalid={Boolean(errors.email)}
          />
        </Field>

        <Field label="Password" error={errors.password}>
          <PasswordInput
            autoComplete="current-password"
            placeholder="Enter your password"
            value={form.password}
            onChange={update('password')}
            invalid={Boolean(errors.password)}
          />
        </Field>

        <SubmitButton loading={loading}>{loading ? 'Logging in...' : 'Log in'}</SubmitButton>
      </form>
    </AuthLayout>
  );
}
