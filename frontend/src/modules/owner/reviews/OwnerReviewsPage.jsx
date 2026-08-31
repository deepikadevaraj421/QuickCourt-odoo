import React, { useEffect, useState } from 'react';
import { Loader2, Star } from 'lucide-react';
import ownerService from '../services/ownerService';

export default function OwnerReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await ownerService.getReviews();
                setReviews(data || []);
                setError('');
            } catch (err) {
                setError(err.message || 'Unable to load reviews');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="p-6 space-y-5">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                <h2 className="text-2xl font-black text-slate-900">Reviews & Ratings</h2>
            </div>
            {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading reviews...</div>
            ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">{error}</div>
            ) : reviews.length ? (
                <div className="space-y-3">
                    {reviews.map(review => (
                        <div key={review.id} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-slate-900">{review.userName || 'Customer'}</div>
                                    <div className="text-xs text-slate-500">{review.facilityName}</div>
                                </div>
                                <div className="flex items-center gap-1 text-amber-500">
                                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Number(review.rating || 0) ? 'fill-current' : 'text-slate-300'}`} />)}
                                </div>
                            </div>
                            <p className="mt-3 text-sm text-slate-600">{review.comment || 'No comment provided.'}</p>
                        </div>
                    ))}
                </div>
            ) : <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">No reviews yet.</div>}
        </div>
    );
}
