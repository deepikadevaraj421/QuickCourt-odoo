import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import FacilityCard from '../components/FacilityCard';
import { Heart } from 'lucide-react';

export const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await userService.getUserFavorites();
      setFavorites(data || []);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (facilityId) => {
    try {
      await userService.removeFavorite(facilityId);
      setFavorites(prev => prev.filter(f => f.id !== facilityId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Saved Favorites</h2>
        <p className="text-xs text-slate-500 mt-0.5">Quick access to your preferred sports venues and courts.</p>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span className="text-xs font-bold text-slate-600">Retrieving favorites...</span>
        </div>
      ) : favorites.length === 0 ? (
        <div className="p-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl space-y-2">
          <Heart className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">No Favorite Facilities Saved</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Click the heart icon on any venue card to save it for quick booking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((fac) => (
            <FacilityCard
              key={fac.id}
              facility={fac}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
