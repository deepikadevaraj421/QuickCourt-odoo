import React from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
      <div className="flex items-center gap-3 text-sm font-semibold">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
        Checking your session...
      </div>
    </div>
  );
}
