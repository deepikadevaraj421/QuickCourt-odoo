import React, { useCallback, useEffect, useState } from 'react';
import { Search, Trash2, ShieldCheck, Clock } from 'lucide-react';
import adminService from '../services/adminService';
import { useAuth } from '../../../auth/context/AuthContext';
import { ROLES } from '../../../auth/utils/roles';

const roleBadge = {
  USER: 'bg-sky-50 text-sky-700 border-sky-100',
  OWNER: 'bg-amber-50 text-amber-700 border-amber-100',
  ADMIN: 'bg-emerald-50 text-emerald-700 border-emerald-100'
};

export default function AdminAccountsPage() {
  const { user: me } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (role) params.role = role;
      setAccounts(await adminService.getAccounts(params));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, role]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const changeRole = async (id, nextRole) => {
    try {
      const updated = await adminService.updateAccountRole(id, nextRole);
      setAccounts((list) => list.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (account) => {
    if (!window.confirm(`Delete account ${account.email}? This cannot be undone.`)) return;
    try {
      await adminService.deleteAccount(account.id);
      setAccounts((list) => list.filter((a) => a.id !== account.id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Accounts</h1>
          <p className="text-sm text-slate-500 mt-1">All registered players, owners and admins.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email"
              className="bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="">All roles</option>
            {Object.values(ROLES).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm px-4 py-3">{error}</div>}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3 font-bold">Name</th>
              <th className="text-left px-5 py-3 font-bold">Email</th>
              <th className="text-left px-5 py-3 font-bold">Role</th>
              <th className="text-left px-5 py-3 font-bold">Status</th>
              <th className="text-left px-5 py-3 font-bold">Joined</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Loading accounts...</td></tr>
            )}
            {!loading && accounts.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">No accounts found.</td></tr>
            )}
            {!loading && accounts.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-3 font-semibold text-slate-900">{a.name}{a.id === me?.id && <span className="ml-2 text-[10px] text-slate-400">(you)</span>}</td>
                <td className="px-5 py-3 text-slate-600">{a.email}</td>
                <td className="px-5 py-3">
                  {a.id === me?.id ? (
                    <span className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-bold ${roleBadge[a.role]}`}>{a.role}</span>
                  ) : (
                    <select
                      value={a.role}
                      onChange={(e) => changeRole(a.id, e.target.value)}
                      className={`rounded-lg border px-2 py-1 text-xs font-bold focus:outline-none ${roleBadge[a.role]}`}
                    >
                      {Object.values(ROLES).map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  )}
                </td>
                <td className="px-5 py-3">
                  {a.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold"><ShieldCheck className="w-3.5 h-3.5" /> Verified</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-semibold"><Clock className="w-3.5 h-3.5" /> Pending</span>
                  )}
                </td>
                <td className="px-5 py-3 text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  {a.id !== me?.id && (
                    <button onClick={() => remove(a)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50" aria-label="Delete account">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
