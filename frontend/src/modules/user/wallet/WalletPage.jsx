import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { Wallet, CreditCard, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const WalletPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await userService.getPayments();
      setPayments(data || []);
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Wallet & Payments</h2>
        <p className="text-xs text-slate-500 mt-0.5">View your wallet balance and recent court booking transaction records.</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase text-emerald-400 tracking-wider">QuickCourt Wallet Balance</span>
          <h3 className="text-3xl font-black">₹1,250.00</h3>
          <p className="text-xs text-slate-400">Used for fast court bookings & automatic refunds.</p>
        </div>

        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl px-5 py-2.5 shadow-md transition flex items-center gap-2">
          <Wallet className="w-4 h-4" /> Add Money
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h4 className="font-extrabold text-slate-900 text-base">Payment History</h4>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span className="text-xs">Loading payment transactions...</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-200 rounded-xl space-y-1">
            <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No payment transaction records found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {payments.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs">{tx.facilityName}</h5>
                    <p className="text-[11px] text-slate-400">{tx.courtName} • {tx.date}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900 text-sm block">₹{tx.amount}</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
