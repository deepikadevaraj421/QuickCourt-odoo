import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { Bell, CheckCircle2, MessageSquare, Calendar, Check } from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await userService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await userService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notifications & Messages</h2>
        <p className="text-xs text-slate-500 mt-0.5">Stay updated on your booking confirmations, cancellations, and match invites.</p>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span className="text-xs font-bold text-slate-600">Retrieving notifications...</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl space-y-2">
          <Bell className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">No Notifications</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">You're all caught up! New booking updates will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition shadow-xs flex items-start justify-between gap-4 ${
                n.isRead ? 'bg-white border-slate-200' : 'bg-emerald-50/40 border-emerald-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl text-white shrink-0 ${n.type === 'BOOKING' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                  {n.type === 'BOOKING' ? <Calendar className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">{n.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 font-medium block">{n.createdAt}</span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 bg-white border border-slate-200 rounded-lg text-xs flex items-center gap-1 shrink-0"
                >
                  <Check className="w-3.5 h-3.5" /> Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
