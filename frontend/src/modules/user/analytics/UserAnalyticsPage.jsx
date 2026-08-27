import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { BarChart3, Calendar, CheckCircle2, XCircle, DollarSign, PieChart } from 'lucide-react';

export const UserAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await userService.getAnalytics();
      setAnalytics(data || null);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <span className="text-xs font-bold text-slate-600">Calculating your athletic analytics from API...</span>
      </div>
    );
  }

  const hasData = analytics && analytics.totalBookings > 0;

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Activity & Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">Track your monthly court reservations, favorite sports distribution, and spending.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Bookings</span>
            <h3 className="text-xl font-black text-slate-900">{analytics?.totalBookings || 0}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400">Upcoming</span>
            <h3 className="text-xl font-black text-slate-900">{analytics?.upcomingCount || 0}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400">Cancelled</span>
            <h3 className="text-xl font-black text-slate-900">{analytics?.cancelledCount || 0}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Investment</span>
            <h3 className="text-xl font-black text-slate-900">₹{analytics?.totalSpent || 0}</h3>
          </div>
        </div>
      </div>

      {/* Dynamic Breakdown Charts or Professional Empty State */}
      {!hasData ? (
        <div className="p-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl space-y-2">
          <PieChart className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">Insufficient Activity Data</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Complete court bookings to unlock visual sports breakdowns and activity metrics.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Favorite Sports Breakdown</h3>
          <div className="space-y-3">
            {analytics.sportDistribution.map((item) => {
              const pct = Math.round((item.count / analytics.totalBookings) * 100);
              return (
                <div key={item.sport} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{item.sport}</span>
                    <span>{item.count} bookings ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAnalyticsPage;
