import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';

export default function OwnerTopbar({ title = 'Owner Dashboard', profile, unreadCount = 0 }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="px-5 md:px-8 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">{title}</h1>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder:text-slate-400"
              placeholder="Search bookings, facilities..."
            />
          </div>

          <button className="relative p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-emerald-500 text-[10px] text-white font-bold flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-black text-slate-950 flex items-center justify-center">
              {profile?.name?.charAt(0)?.toUpperCase() || 'L'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-bold text-slate-900">{profile?.name || 'Lina'}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">OWNER</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
