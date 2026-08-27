import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PopularSportsCard = ({ onSelectSport }) => {
  const sports = [
    { name: 'Badminton', count: '1,245 bookings', icon: '🏸' },
    { name: 'Football', count: '932 bookings', icon: '⚽' },
    { name: 'Cricket', count: '614 bookings', icon: '🏏' },
    { name: 'Tennis', count: '489 bookings', icon: '🎾' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-slate-900 text-sm">Popular Sports</h4>
        <Link to="/user/facilities" className="text-xs font-bold text-emerald-600 hover:underline">
          View All
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {sports.map((item) => (
          <div
            key={item.name}
            onClick={() => onSelectSport && onSelectSport(item.name)}
            className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-xl px-2 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm shadow-xs">
                {item.icon}
              </span>
              <div>
                <h6 className="font-bold text-slate-900 text-xs">{item.name}</h6>
                <span className="text-[11px] text-slate-400">{item.count}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularSportsCard;
