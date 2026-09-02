import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLogout } from '../../../auth/hooks/useLogout';
import { 
  Home, Search, CalendarCheck, Users, Activity, Heart, Wallet, 
  Star, MessageSquare, Settings, LogOut, MapPin, Gift, Menu 
} from 'lucide-react';

export const UserSidebar = ({ unreadCount = 2 }) => {
  const location = useLocation();
  const logout = useLogout();

  const navItems = [
    { label: 'Home', icon: Home, path: '/user' },
    { label: 'Explore Facilities', icon: Search, path: '/user/facilities' },
    { label: 'My Bookings', icon: CalendarCheck, path: '/user/bookings' },
    { label: 'Match Hub', icon: Users, path: '/user/matches' },
    { label: 'My Matches', icon: Activity, path: '/user/my-matches' },
    { label: 'Favorites', icon: Heart, path: '/user/favorites' },
    { label: 'Wallet & Payments', icon: Wallet, path: '/user/wallet' },
    { label: 'Reviews', icon: Star, path: '/user/reviews' },
    { label: 'Messages', icon: MessageSquare, path: '/user/notifications', badge: unreadCount },
    { label: 'Profile Settings', icon: Settings, path: '/user/profile' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-5 sticky top-0 h-screen z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 mb-4 border-b border-slate-100">
          <Link to="/user" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-extrabold shadow-md shadow-emerald-500/20">
              <MapPin className="w-5 h-5 fill-white text-emerald-500" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Quick<span className="text-emerald-600">Court</span>
            </span>
          </Link>
          <button className="text-slate-400 hover:text-slate-600 p-1">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/user' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Offer Card & Logout */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        {/* Play More, Save More Promo Card */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 relative overflow-hidden">
          <div className="max-w-[130px]">
            <h5 className="font-bold text-slate-900 text-xs leading-snug">Play More, Save More!</h5>
            <p className="text-[11px] text-slate-500 mt-1 mb-3">Get up to 20% off on selected venues.</p>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg px-3 py-1.5 shadow-xs transition">
              View Offers
            </button>
          </div>
          <Gift className="w-12 h-12 text-emerald-400 opacity-80 absolute -right-1 -bottom-1 rotate-12 pointer-events-none" />
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 cursor-pointer hover:text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
