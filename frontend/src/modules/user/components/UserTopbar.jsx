import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Bell, Heart, ChevronDown } from 'lucide-react';

export const UserTopbar = ({ search, setSearch, profile, unreadCount = 1, favoritesCount = 8 }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search Input & Location Dropdown */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search || ''}
            onChange={(e) => setSearch && setSearch(e.target.value)}
            placeholder="Search for facilities, sports or locations..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Chennai</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </div>
      </div>

      {/* Right Icons & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <Link
          to="/user/notifications"
          className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Favorites Icon */}
        <Link
          to="/user/favorites"
          className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
        >
          <Heart className="w-5 h-5" />
        </Link>

        {/* User Profile Pill */}
        <Link to="/user/profile" className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <img
            src={profile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
            alt="Deepika R"
            className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/30"
          />
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-xs font-bold text-slate-900">{profile?.name || 'Deepika R'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default UserTopbar;
