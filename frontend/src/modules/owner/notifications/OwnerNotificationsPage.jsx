import React, { useEffect, useState } from 'react';
import { Loader2, Bell } from 'lucide-react';
import ownerService from '../services/ownerService';

export default function OwnerNotificationsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        try {
            setLoading(true);
            const data = await ownerService.getNotifications();
            setItems(data || []);
            setError('');
        } catch (err) {
            setError(err.message || 'Unable to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const markAsRead = async (id) => {
        try {
            await ownerService.markNotificationRead(id);
            await load();
        } catch (err) {
            setError(err.message || 'Unable to mark notification as read');
        }
    };

    return (
        <div className="p-6 space-y-5">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                <h2 className="text-2xl font-black text-slate-900">Notifications</h2>
            </div>
            {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading notifications...</div>
            ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">{error}</div>
            ) : items.length ? (
                <div className="space-y-3">
                    {items.map(item => (
                        <div key={item.id} className={`rounded-2xl border p-4 ${item.isRead ? 'bg-white border-slate-200' : 'bg-emerald-50 border-emerald-200'}`}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-slate-100 p-2"><Bell className="w-4 h-4 text-slate-600" /></div>
                                    <div>
                                        <div className="font-bold text-slate-900">{item.title}</div>
                                        <div className="text-sm text-slate-600">{item.message}</div>
                                    </div>
                                </div>
                                {!item.isRead && <button onClick={() => markAsRead(item.id)} className="text-xs font-bold text-emerald-700">Mark read</button>}
                            </div>
                        </div>
                    ))}
                </div>
            ) : <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">No notifications yet.</div>}
        </div>
    );
}
