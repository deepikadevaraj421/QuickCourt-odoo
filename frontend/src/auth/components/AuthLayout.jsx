import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarCheck, Users, ShieldCheck } from 'lucide-react';

const highlights = [
  { icon: CalendarCheck, title: 'Instant court booking', text: 'Real-time availability across verified venues.' },
  { icon: Users, title: 'Match Hub', text: 'Find players at your skill level and join games.' },
  { icon: ShieldCheck, title: 'Secure accounts', text: 'Email-verified sign up with role-based access.' }
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Brand panel */}
      <aside className="hidden lg:flex w-[46%] flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <MapPin className="w-6 h-6 fill-white text-emerald-500" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight">
            Quick<span className="text-emerald-400">Court</span>
          </span>
        </Link>

        <div className="relative space-y-8">
          <div>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">Sports facility platform</p>
            <h2 className="text-4xl font-black leading-tight tracking-tight">
              Book courts. Find matches.<br />Play more.
            </h2>
          </div>
          <ul className="space-y-4">
            {highlights.map(({ icon: Icon, title: t, text }) => (
              <li key={t} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <div className="font-bold text-sm">{t}</div>
                  <div className="text-slate-300 text-sm">{text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-400">© {new Date().getFullYear()} QuickCourt. All rights reserved.</p>
      </aside>

      {/* Form panel */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <MapPin className="w-5 h-5 fill-white text-emerald-500" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              Quick<span className="text-emerald-600">Court</span>
            </span>
          </Link>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 sm:p-10">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 mt-2">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </div>

          {footer && <div className="text-center text-sm text-slate-500 mt-6">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
