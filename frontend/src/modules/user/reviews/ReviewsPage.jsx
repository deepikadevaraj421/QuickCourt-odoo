import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { Star, MessageSquare, Plus, X } from 'lucide-react';

export const ReviewsPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add review modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      const facs = await userService.getFacilities();
      setFacilities(facs || []);
      if (facs && facs.length > 0) {
        setSelectedFacilityId(facs[0].id);
        fetchReviews(facs[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load facilities:', err);
      setLoading(false);
    }
  };

  const fetchReviews = async (facId) => {
    setLoading(true);
    try {
      const data = await userService.getFacilityReviews(facId);
      setReviews(data || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFacilityChange = (facId) => {
    setSelectedFacilityId(facId);
    fetchReviews(facId);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await userService.addReview({
        facilityId: selectedFacilityId,
        rating,
        comment
      });
      setShowAddModal(false);
      setComment('');
      fetchReviews(selectedFacilityId);
    } catch (err) {
      alert(err.message || 'Failed to add review');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Facility Reviews & Ratings</h2>
          <p className="text-xs text-slate-500 mt-0.5">Read player feedback and share your court experience.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl px-4 py-2.5 shadow-sm transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {/* Select Facility Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3">
        <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Select Facility:</span>
        <select
          value={selectedFacilityId}
          onChange={(e) => handleFacilityChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 flex-1 focus:outline-none focus:border-emerald-500"
        >
          {facilities.map(f => (
            <option key={f.id} value={f.id}>{f.name} ({f.location})</option>
          ))}
        </select>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span className="text-xs font-bold text-slate-600">Retrieving reviews from backend API...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl space-y-2">
          <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">No Reviews Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Be the first player to submit a review for this facility!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    {r.userName ? r.userName[0] : 'U'}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs">{r.userName}</h5>
                    <span className="text-[10px] text-slate-400">{r.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{r.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Write a Review</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Rating</label>
                <div className="flex gap-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Your Review</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about court quality, lighting, and staff..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl px-5 py-2.5 shadow-sm"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
