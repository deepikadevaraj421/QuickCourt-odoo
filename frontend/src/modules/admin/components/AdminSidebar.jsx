import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, LogOut, MapPin, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../auth/context/AuthContext';
import { useLogout } from '../../../auth/hooks/useLogout';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Accounts', path: '/admin/accounts', icon: Users },
  { label: 'Facilities', path: '/admin/facilities', icon: Building2 }
];

export default function AdminSidebar() {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-5 sticky top-0 h-screen z-30">
      <div>
        <div className="flex items-center gap-2.5 pb-6 mb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <MapPin className="w-5 h-5 fill-white text-emerald-500" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
              Quick<span className="text-emerald-600">Court</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1">Admin Console</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-black flex items-center justify-center">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 truncate">{user?.name}</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Administrator
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
