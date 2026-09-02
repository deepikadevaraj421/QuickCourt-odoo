import React, { useEffect, useState } from 'react';
import { Users, Building2, Trophy, CalendarCheck, Swords, Star, ShieldCheck, Clock } from 'lucide-react';
import adminService from '../services/adminService';
import { useAuth } from '../../../auth/context/AuthContext';

const ACCENTS = {
  emerald: ['bg-emerald-50 border-emerald-100', 'text-emerald-600'],
  sky: ['bg-sky-50 border-sky-100', 'text-sky-600'],
  amber: ['bg-amber-50 border-amber-100', 'text-amber-600'],
  rose: ['bg-rose-50 border-rose-100', 'text-rose-600']
};

function StatCard({ icon: Icon, label, value, accent = 'emerald' }) {
  const [box, text] = ACCENTS[accent];
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${box}`}>
        <Icon className={`w-5 h-5 ${text}`} />
      </div>
      <div>
        <div className="text-2xl font-black text-slate-900 leading-none">{value ?? '—'}</div>
        <div className="text-xs text-slate-500 mt-1">{label}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getSummary().then(setSummary).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back, {user?.name}. Platform-wide overview.</p>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm px-4 py-3">{error}</div>}

      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Accounts</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard icon={Users} label="Total accounts" value={summary?.accounts.total} />
          <StatCard icon={Users} label="Players" value={summary?.accounts.users} accent="sky" />
          <StatCard icon={Building2} label="Owners" value={summary?.accounts.owners} accent="amber" />
          <StatCard icon={ShieldCheck} label="Verified" value={summary?.accounts.verified} />
          <StatCard icon={Clock} label="Pending verification" value={summary?.accounts.pending} accent="rose" />
        </div>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Platform</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard icon={Building2} label="Facilities" value={summary?.facilities} />
          <StatCard icon={Trophy} label="Courts" value={summary?.courts} />
          <StatCard icon={CalendarCheck} label="Bookings" value={summary?.bookings} accent="sky" />
          <StatCard icon={Swords} label="Matches" value={summary?.matches} accent="amber" />
          <StatCard icon={Star} label="Reviews" value={summary?.reviews} />
        </div>
      </section>
    </div>
  );
}
