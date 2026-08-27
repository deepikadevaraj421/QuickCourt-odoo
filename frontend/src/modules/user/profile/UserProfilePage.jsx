import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { User, Mail, Phone, MapPin, Check, Save } from 'lucide-react';

export const UserProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    favoriteSports: []
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const availableSports = ['Badminton', 'Football', 'Tennis', 'Cricket', 'Basketball', 'Table Tennis'];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await userService.getProfile();
      if (data) setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSportToggle = (sport) => {
    const exists = profile.favoriteSports?.includes(sport);
    const updated = exists
      ? profile.favoriteSports.filter(s => s !== sport)
      : [...(profile.favoriteSports || []), sport];
    setProfile({ ...profile, favoriteSports: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <span className="text-xs font-bold text-slate-600">Loading user profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in pb-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Profile Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage your personal information and sports preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Header Avatar Info */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/30"
          />
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">{profile.name}</h3>
            <span className="text-xs text-slate-500">{profile.email}</span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-semibold"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-semibold"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-semibold"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400 block mb-1">City / Location</label>
            <div className="relative">
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-semibold"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Favorite Sports Selector */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold uppercase text-slate-400 block">Favorite Sports Preferences</label>
          <div className="flex flex-wrap gap-2">
            {availableSports.map((sport) => {
              const isSelected = profile.favoriteSports?.includes(sport);
              return (
                <button
                  key={sport}
                  type="button"
                  onClick={() => handleSportToggle(sport)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}{sport}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Profile Updated Successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl px-6 py-2.5 shadow-sm transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfilePage;
