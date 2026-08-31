import React, { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import ownerService from '../services/ownerService';

export default function OwnerProfilePage() {
    const [profile, setProfile] = useState({ name: '', email: '', phone: '', location: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const load = async () => {
        try {
            setLoading(true);
            const data = await ownerService.getProfile();
            setProfile({ ...profile, ...data });
            setError('');
        } catch (err) {
            setError(err.message || 'Unable to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleSave = async e => {
        e.preventDefault();
        try {
            setSaving(true);
            const data = await ownerService.updateProfile(profile);
            setProfile(data);
        } catch (err) {
            setError(err.message || 'Unable to save profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 max-w-2xl">
                <h2 className="text-2xl font-black text-slate-900">Profile</h2>
                {loading ? <div className="mt-4 text-slate-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading profile...</div> : (
                    <form onSubmit={handleSave} className="mt-5 space-y-4">
                        <input value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full border rounded-xl px-3 py-2" placeholder="Owner name" />
                        <input value={profile.email || ''} onChange={e => setProfile({ ...profile, email: e.target.value })} className="w-full border rounded-xl px-3 py-2" placeholder="Email" />
                        <input value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full border rounded-xl px-3 py-2" placeholder="Phone" />
                        <input value={profile.location || ''} onChange={e => setProfile({ ...profile, location: e.target.value })} className="w-full border rounded-xl px-3 py-2" placeholder="Location" />
                        {error && <div className="text-red-700 text-sm">{error}</div>}
                        <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white font-bold px-4 py-2.5">
                            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save profile'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
