import React from 'react';
import { Heart, Star, CheckCircle, MapPin, Clock } from 'lucide-react';

export const FacilityCard = ({ facility, onSelect, onToggleFavorite }) => {
  if (!facility) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition duration-200 shadow-xs flex flex-col sm:flex-row group">
      {/* Facility Image */}
      <div className="relative w-full sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden">
        <img
          src={facility.image}
          alt={facility.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Discount Badge */}
        {facility.discountPercentage > 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-[11px] font-extrabold shadow-sm">
            {facility.discountPercentage}% OFF
          </span>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite && onToggleFavorite(facility.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
            facility.isFavorite
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-slate-900/40 text-white hover:bg-slate-900/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${facility.isFavorite ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Facility Info Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Verification */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-600 transition">
                {facility.name}
              </h3>
              {facility.verified && (
                <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
              )}
            </div>
          </div>

          {/* Location & Distance */}
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{facility.location}</span>
            {facility.distance && (
              <>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-600">{facility.distance}</span>
              </>
            )}
          </p>

          {/* Sports & Amenities Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {facility.sports?.map((s) => (
              <span key={s} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                {s}
              </span>
            ))}
            {facility.amenities?.slice(0, 3).map((a) => (
              <span key={a} className="px-2.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200/80 rounded-md text-[11px]">
                {a}
              </span>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-3 text-xs">
            <div className="flex items-center text-amber-500 font-bold gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{facility.rating}</span>
            </div>
            <span className="text-slate-400">({facility.reviewsCount} reviews)</span>
          </div>

          {/* Availability Status */}
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{facility.operatingHours}</span>
          </div>
        </div>

        {/* Price & Action Button Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-slate-900">₹{facility.startingPrice}</span>
              <span className="text-xs text-slate-400 font-medium">/hour</span>
            </div>
            <span className="text-[10px] text-slate-400 block">Starting from</span>
          </div>

          <button
            onClick={() => onSelect && onSelect(facility)}
            className="border-1.5 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold rounded-xl px-4 py-2 text-xs transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;
