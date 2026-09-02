import React, { useEffect, useState } from 'react';
import { MapPin, Star, BadgeCheck } from 'lucide-react';
import adminService from '../services/adminService';

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getFacilities().then(setFacilities).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Facilities</h1>
        <p className="text-sm text-slate-500 mt-1">All venues listed on the platform.</p>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm px-4 py-3">{error}</div>}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {facilities.map((f) => (
          <div key={f.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <img src={f.image} alt={f.name} className="h-36 w-full object-cover" />
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{f.name}</h3>
                {f.verified && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3.5 h-3.5" /> {f.location}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-amber-600 font-semibold"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {f.rating} ({f.reviewsCount})</span>
                <span className="text-slate-500">{f.courtsCount} courts</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(f.sports || []).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
