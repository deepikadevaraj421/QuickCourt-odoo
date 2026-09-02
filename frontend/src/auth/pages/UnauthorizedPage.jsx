import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { homeForRole } from '../utils/roles';

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const location = useLocation();
  const home = location.state?.home || homeForRole(user?.role);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
          <ShieldAlert className="w-7 h-7 text-rose-500" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-6">Access denied</h1>
        <p className="text-sm text-slate-500 mt-2">
          Your account{user?.role ? ` (${user.role})` : ''} doesn&apos;t have permission to view this page.
        </p>
        <Link
          to={home}
          className="inline-flex mt-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 shadow-md shadow-emerald-500/20 transition"
        >
          Go to my dashboard
        </Link>
      </div>
    </div>
  );
}
