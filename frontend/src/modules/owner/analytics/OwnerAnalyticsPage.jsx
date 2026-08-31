import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ownerService from '../services/ownerService';

export default function OwnerAnalyticsPage() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await ownerService.getAnalytics();
                setAnalytics(data || {});
                setError('');
            } catch (err) {
                setError(err.message || 'Unable to load analytics');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div className="p-6 rounded-2xl border border-slate-200 bg-white text-slate-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading analytics...</div>;
    if (error) return <div className="p-6 rounded-2xl border border-red-200 bg-red-50 text-red-700">{error}</div>;

    return (
        <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white border border-slate-200 p-5"><div className="text-xs uppercase text-slate-500">Total bookings</div><div className="mt-3 text-3xl font-black text-slate-900">{analytics?.totalBookings ?? 0}</div></div>
                <div className="rounded-2xl bg-white border border-slate-200 p-5"><div className="text-xs uppercase text-slate-500">Revenue</div><div className="mt-3 text-3xl font-black text-slate-900">₹{analytics?.totalRevenue ?? 0}</div></div>
                <div className="rounded-2xl bg-white border border-slate-200 p-5"><div className="text-xs uppercase text-slate-500">Avg. rating</div><div className="mt-3 text-3xl font-black text-slate-900">{Number(analytics?.averageRating || 0).toFixed(1)}</div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-2xl bg-white border border-slate-200 p-5">
                    <h3 className="text-lg font-black text-slate-900">Popular courts</h3>
                    <div className="mt-4 space-y-3">{(analytics?.popularCourts || []).length ? analytics.popularCourts.map(item => <div key={item.court} className="flex justify-between text-sm"><span>{item.court}</span><span className="font-bold">{item.count}</span></div>) : <div className="text-slate-500">No booking data available for this period.</div>}</div>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-5">
                    <h3 className="text-lg font-black text-slate-900">Popular sports</h3>
                    <div className="mt-4 space-y-3">{(analytics?.popularSports || []).length ? analytics.popularSports.map(item => <div key={item.sport} className="flex justify-between text-sm"><span>{item.sport}</span><span className="font-bold">{item.count}</span></div>) : <div className="text-slate-500">No analytics data available.</div>}</div>
                </div>
            </div>
        </div>
    );
}
