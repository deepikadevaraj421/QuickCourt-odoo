import React from 'react';
import { BarChart3, Building2, CalendarRange, CreditCard, LayoutDashboard, LogOut, MessageSquareQuote, Bell, UserCircle2, Trophy, MapPinned } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLogout } from '../../../auth/hooks/useLogout';

const navItems = [
    { label: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'My Facilities', path: '/owner/facilities', icon: Building2 },
    { label: 'Courts', path: '/owner/courts', icon: Trophy },
    { label: 'Availability / Calendar', path: '/owner/availability', icon: CalendarRange },
    { label: 'Bookings', path: '/owner/bookings', icon: MapPinned },
    { label: 'Earnings', path: '/owner/earnings', icon: CreditCard },
    { label: 'Reviews & Ratings', path: '/owner/reviews', icon: MessageSquareQuote },
    { label: 'Notifications', path: '/owner/notifications', icon: Bell },
    { label: 'Analytics', path: '/owner/analytics', icon: BarChart3 },
    { label: 'Profile', path: '/owner/profile', icon: UserCircle2 }
];

export default function OwnerSidebar({ profile, unreadCount = 0 }) {
    const logout = useLogout();
    return (
        <aside className="w-full md:w-72 bg-slate-950 text-slate-100 min-h-screen border-r border-slate-800 flex flex-col">
            <div className="px-6 py-7 border-b border-slate-800 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-black">Q</div>
                <div>
                    <div className="text-lg font-extrabold tracking-tight">QuickCourt</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Owner Portal</div>
                </div>
            </div>

            <nav className="px-4 py-5 space-y-1 flex-1">
                {navItems.map(({ label, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => `group flex items-center gap-3 px-3 py-3 rounded-xl transition ${isActive ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'}`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-slate-800 p-4">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-900 p-3 border border-slate-800">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-sm font-black text-slate-950">
                        {profile?.name?.charAt(0)?.toUpperCase() || 'L'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{profile?.name || 'Lina'}</div>
                        <div className="text-[11px] text-slate-400">Facility Owner</div>
                    </div>
                    <button type="button" onClick={logout} className="ml-auto p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" aria-label="Logout">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
