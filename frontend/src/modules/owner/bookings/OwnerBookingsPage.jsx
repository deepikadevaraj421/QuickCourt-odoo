import React, { useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import ownerService from '../services/ownerService';

export default function OwnerBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [status, setStatus] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        try {
            setLoading(true);
            const data = await ownerService.getBookings({ status: status !== 'ALL' ? status : '' });
            setBookings(data || []);
            setError('');
        } catch (err) {
            setError(err.message || 'Unable to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [status]);

    return (
        <div className="p-6 space-y-5">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Bookings</h2>
                        <p className="text-sm text-slate-500">All bookings for your facilities.</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <Search className="w-4 h-4 text-slate-500" />
                        <input placeholder="Search bookings" className="bg-transparent outline-none text-sm" />
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {['ALL', 'Confirmed', 'Cancelled', 'Completed'].map(item => (
                        <button key={item} onClick={() => setStatus(item)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${status === item ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading bookings...</div>
            ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">{error}</div>
            ) : bookings.length ? (
                <div className="space-y-3">
                    {bookings.map(booking => (
                        <div key={booking.id} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div>
                                    <div className="font-black text-slate-900">{booking.facilityName}</div>
                                    <div className="text-sm text-slate-500">{booking.courtName} · {booking.date} · {booking.timeSlot}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-900">₹{booking.price}</div>
                                    <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full inline-flex">{booking.status}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">No bookings found.</div>}
        </div>
    );
}
