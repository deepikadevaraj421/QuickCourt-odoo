import React, { useEffect, useState } from 'react';
import { Plus, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import ownerService from '../services/ownerService';

export default function OwnerFacilitiesPage() {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', location: '', city: 'Chennai', sports: 'Badminton', amenities: 'Parking', description: '' });

    const loadFacilities = async () => {
        try {
            setLoading(true);
            const data = await ownerService.getFacilities();
            setFacilities(data || []);
            setError('');
        } catch (err) {
            setError(err.message || 'Unable to load facilities');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadFacilities(); }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await ownerService.createFacility({ ...form, sports: [form.sports], amenities: [form.amenities] });
            setForm({ name: '', location: '', city: 'Chennai', sports: 'Badminton', amenities: 'Parking', description: '' });
            await loadFacilities();
        } catch (err) {
            setError(err.message || 'Unable to create facility');
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">My Facilities</h2>
                        <p className="text-sm text-slate-500">Manage facilities and approval status.</p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 text-white px-3 py-2 text-sm font-bold">
                        <Plus className="w-4 h-4" /> Add Facility
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Facility name" className="border rounded-xl px-3 py-2" required />
                    <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location" className="border rounded-xl px-3 py-2" required />
                    <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="City" className="border rounded-xl px-3 py-2" />
                    <input value={form.sports} onChange={e => setForm({ ...form, sports: e.target.value })} placeholder="Sport" className="border rounded-xl px-3 py-2" />
                    <input value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} placeholder="Amenity" className="border rounded-xl px-3 py-2 md:col-span-2" />
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="border rounded-xl px-3 py-2 md:col-span-2" rows="3" />
                    <button type="submit" className="md:col-span-2 rounded-xl bg-emerald-600 text-white font-bold py-2.5">Create facility</button>
                </form>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading facilities...</div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">{error}</div>
                ) : facilities.length ? facilities.map(facility => (
                    <div key={facility.id} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-4">
                        <img src={facility.image} alt={facility.name} className="w-full md:w-52 h-36 rounded-xl object-cover" />
                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <h3 className="text-xl font-black text-slate-900">{facility.name}</h3>
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-1">
                                    <CheckCircle2 className="w-3 h-3" /> {facility.status || 'Approved'}
                                </span>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500"><MapPin className="w-4 h-4" /> {facility.location}</div>
                            <p className="mt-2 text-sm text-slate-600">{facility.description}</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                                {(facility.sports || []).map(sport => <span key={sport} className="rounded-full bg-slate-100 px-2 py-1">{sport}</span>)}
                            </div>
                        </div>
                    </div>
                )) : <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">No facilities yet.</div>}
            </div>
        </div>
    );
}
