import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-700 mb-1.5">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}

export function TextInput({ invalid, className = '', ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
        invalid
          ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
      } ${className}`}
    />
  );
}

export function PasswordInput(props) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <TextInput {...props} type={show ? 'text' : 'password'} className="pr-11" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        aria-label={show ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

export function SubmitButton({ loading, children, ...props }) {
  return (
    <button
      type="submit"
      disabled={loading || props.disabled}
      {...props}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 shadow-md shadow-emerald-500/20 transition"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Alert({ type = 'error', children }) {
  if (!children) return null;
  const styles =
    type === 'success'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
      : type === 'info'
        ? 'bg-sky-50 border-sky-200 text-sky-800'
        : 'bg-rose-50 border-rose-200 text-rose-700';
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;
  return (
    <div role="alert" className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${styles}`}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
