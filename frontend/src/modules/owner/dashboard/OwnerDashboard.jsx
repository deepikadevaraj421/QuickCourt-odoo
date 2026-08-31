import React, { useEffect, useState } from 'react';
import { ArrowUpRight, CalendarClock, DollarSign, Star, Building2, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';
import ownerService from '../services/ownerService';

const formatCurrency = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function OwnerDashboard() {
    const [summary, setSummary] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [summaryData, scheduleData] = await Promise.all([
                    ownerService.getDashboardSummary(),
                    ownerService.getDashboardSchedule()
                ]);
                setSummary(summaryData);
                setSchedule(scheduleData || []);
            } catch (err) {
                setError(err.message || 'Unable to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <div className="p-6 text-sm text-slate-500">Loading dashboard…</div>;
    }

    if (error) {
        return <div className="p-6 rounded-2xl border border-red-200 bg-red-50 text-red-700">{error}</div>;
    }

    const stats = [
        { label: 'Total Bookings', value: summary?.totalBookings ?? 0, icon: CalendarClock, accent: 'bg-sky-100 text-sky-700' },
        { label: 'Active Courts', value: summary?.activeCourts ?? 0, icon: Building2, accent: 'bg-violet-100 text-violet-700' },
        { label: 'Earnings / Revenue', value: formatCurrency(summary?.totalEarnings ?? 0), icon: DollarSign, accent: 'bg-emerald-100 text-emerald-700' },
        { label: 'Average Rating', value: `${Number(summary?.averageRating || 0).toFixed(1)}/5`, icon: Star, accent: 'bg-amber-100 text-amber-700' }
    ];

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, accent }) => (
                    <div key={label} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
                                <h3 className="mt-3 text-2xl font-black text-slate-900">{value}</h3>
                            </div>
                            <div className={`${accent} h-12 w-12 rounded-xl flex items-center justify-center`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Booking overview</h3>
                            <p className="text-xs text-slate-500">Revenue by month</p>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                            <TrendingUp className="w-4 h-4" />
                            Upward trend
                        </div>
                    </div>
                    <div className="space-y-4">
                        {(summary?.revenueTrend?.length ? summary.revenueTrend : []).map(item => (
                            <div key={item.month}>
                                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                                    <span>{item.month}</span>
                                    <span>{formatCurrency(item.total)}</span>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${Math.min((item.total / (summary?.totalEarnings || 1)) * 100, 100)}%` }} />
                                </div>
                            </div>
                        )) || <div className="text-sm text-slate-500">No booking data available for this period.</div>}
                    </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-black text-slate-900">Today's schedule</h3>
                        <Activity className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="space-y-3">
                        {schedule.length ? schedule.map(item => (
                            <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <div className="text-xs font-bold text-slate-500">{item.time}</div>
                                <div className="mt-2 text-sm font-bold text-slate-900">{item.court}</div>
                                <div className="text-sm text-slate-600">{item.customer}</div>
                                <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> {item.status}
                                </div>
                            </div>
                        )) : <div className="text-sm text-slate-500">No bookings scheduled yet.</div>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black text-slate-900">My facilities</h3>
                        <button className="text-xs font-bold text-emerald-600">Manage</button>
                    </div>
                    <div className="space-y-3">
                        <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                            <div>
                                <div className="font-bold text-slate-900">PlayZone Arena</div>
                                <div className="text-xs text-slate-500">2 courts • Approved</div>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Approved</span>
                        </div>
                        <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                            <div>
                                <div className="font-bold text-slate-900">Champion Turf</div>
                                <div className="text-xs text-slate-500">2 courts • Pending</div>
                            </div>
                            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Pending</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black text-slate-900">Recent bookings</h3>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="space-y-3">
                        {(summary?.recentBookings || []).length ? summary.recentBookings.map(item => (
                            <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                <div>
                                    <div className="font-bold text-slate-900">{item.facilityName || 'Facility'}</div>
                                    <div className="text-xs text-slate-500">{item.courtName || 'Court'} · {item.date}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-900">{formatCurrency(item.price)}</div>
                                    <div className="text-[11px] text-emerald-600 font-bold">{item.status}</div>
                                </div>
                            </div>
                        )) : <div className="text-sm text-slate-500">No bookings found.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
