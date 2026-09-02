import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { Field, TextInput, SubmitButton, Alert } from '../components/FormControls';
import { useAuth } from '../context/AuthContext';
import { homeForRole } from '../utils/roles';
import { validateEmail, validateOtp } from '../utils/validation';

const RESEND_SECONDS = 30;

export default function VerifyOtpPage() {
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [notice, setNotice] = useState(location.state?.notice || '');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(location.state?.email ? RESEND_SECONDS : 0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = { email: validateEmail(email), otp: validateOtp(otp) };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    setServerError('');
    try {
      const user = await verifyOtp({ email: email.trim(), otp });
      navigate(homeForRole(user.role), { replace: true });
    } catch (err) {
      setServerError(err.message || 'Verification failed. Please try again.');
      if (err.status === 400 && /already verified/i.test(err.message || '')) {
        navigate('/login', { state: { email: email.trim(), notice: err.message } });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors((er) => ({ ...er, email: emailError }));
      return;
    }
    setResending(true);
    setServerError('');
    setNotice('');
    try {
      await resendOtp({ email: email.trim() });
      setOtp('');
      setNotice(`A new code has been sent to ${email.trim()}.`);
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setServerError(err.message || 'Could not resend the code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit code we emailed you to activate your account."
      footer={
        <>
          Wrong account?{' '}
          <Link to="/register" className="font-bold text-emerald-700 hover:text-emerald-800">
            Register again
          </Link>{' '}
          or{' '}
          <Link to="/login" className="font-bold text-emerald-700 hover:text-emerald-800">
            log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <MailCheck className="w-7 h-7 text-emerald-600" />
          </div>
        </div>

        <Alert type="success">{notice}</Alert>
        <Alert>{serverError}</Alert>

        <Field label="Email address" error={errors.email}>
          <TextInput
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((er) => ({ ...er, email: '' }));
            }}
            invalid={Boolean(errors.email)}
          />
        </Field>

        <Field label="Verification code" error={errors.otp}>
          <TextInput
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="••••••"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
              setErrors((er) => ({ ...er, otp: '' }));
              setServerError('');
            }}
            invalid={Boolean(errors.otp)}
            className="text-center text-2xl font-black tracking-[0.5em]"
          />
        </Field>

        <SubmitButton loading={loading}>{loading ? 'Verifying...' : 'Verify & continue'}</SubmitButton>

        <div className="text-center text-sm text-slate-500">
          Didn&apos;t get the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="font-bold text-emerald-700 hover:text-emerald-800 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            {resending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
