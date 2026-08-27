import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await userService.getUserBookings(activeTab === 'ALL' ? '' : activeTab);
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(id);
    try {
      await userService.cancelBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Bookings</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage your upcoming games, past court reservations, and cancellations.</p>
        </div>
        <button
          onClick={fetchBookings}
          className="p-2 text-slate-500 hover:text-emerald-600 bg-white border border-slate-200 rounded-xl transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'ALL', label: 'All Bookings' },
          { id: 'Confirmed', label: 'Upcoming' },
          { id: 'Completed', label: 'Completed' },
          { id: 'Cancelled', label: 'Cancelled' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span className="text-xs font-bold text-slate-600">Retrieving bookings...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl space-y-2">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">No Bookings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">You do not have any {activeTab !== 'ALL' ? activeTab.toLowerCase() : ''} bookings at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={b.facilityImage || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=300&q=80"}
                  alt={b.facilityName}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md uppercase">
                      {b.sport}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                      b.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : b.status === 'Completed'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base">{b.facilityName}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{b.courtName}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {b.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {b.timeSlot}</span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-2">
                <span className="text-lg font-black text-slate-900">₹{b.price}</span>
                {b.status === 'Confirmed' && (
                  <button
                    disabled={cancellingId === b.id}
                    onClick={() => handleCancelBooking(b.id)}
                    className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition disabled:opacity-50"
                  >
                    {cancellingId === b.id ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
