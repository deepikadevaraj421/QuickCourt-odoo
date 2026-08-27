import React from 'react';
import { Calendar, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UpcomingBookingCard = ({ booking }) => {
  if (!booking) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-slate-900 text-sm">Upcoming Booking</h4>
          <Link to="/user/bookings" className="text-xs font-bold text-emerald-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
          <p className="text-xs text-slate-500">No upcoming bookings scheduled.</p>
          <Link to="/user/facilities" className="mt-2 text-xs font-bold text-emerald-600 inline-flex items-center gap-1 hover:underline">
            Book a court now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-slate-900 text-sm">Upcoming Booking</h4>
        <Link to="/user/bookings" className="text-xs font-bold text-emerald-600 hover:underline">
          View All
        </Link>
      </div>

      <div className="flex items-start gap-3">
        <img
          src={booking.facilityImage || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=300&q=80"}
          alt={booking.facilityName}
          className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h5 className="font-extrabold text-slate-900 text-sm truncate">{booking.facilityName}</h5>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">{booking.courtName}</p>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {booking.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {booking.timeSlot}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-sm font-black text-slate-900">₹{booking.price}</span>
        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-extrabold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Confirmed
        </span>
      </div>

      <Link
        to="/user/bookings"
        className="block text-center border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 font-semibold rounded-xl py-2 w-full text-xs transition"
      >
        View Booking Details
      </Link>
    </div>
  );
};

export default UpcomingBookingCard;
