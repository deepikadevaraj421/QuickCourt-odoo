import React from 'react';
import { Calendar, ShieldCheck, Clock, Trophy } from 'lucide-react';

export const BenefitsBar = () => {
  const benefits = [
    {
      title: 'Easy Booking',
      desc: 'Book your favorite court in just a few clicks.',
      icon: Calendar
    },
    {
      title: 'Secure Payments',
      desc: '100% secure and hassle-free payments.',
      icon: ShieldCheck
    },
    {
      title: 'Real-time Availability',
      desc: 'Check live availability and book instantly.',
      icon: Clock
    },
    {
      title: 'Play & Enjoy',
      desc: 'Play your best and enjoy the game!',
      icon: Trophy
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {benefits.map((b, idx) => (
        <div key={idx} className="flex items-start gap-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shrink-0">
            <b.icon className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-extrabold text-slate-900 text-xs">{b.title}</h5>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BenefitsBar;
