import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import FacilityCard from '../components/FacilityCard';
import UpcomingBookingCard from '../components/UpcomingBookingCard';
import PopularSportsCard from '../components/PopularSportsCard';
import BenefitsBar from '../components/BenefitsBar';
import { 
  Search, MapPin, Calendar, Clock, SlidersHorizontal, Sparkles, Trophy, Star, ArrowRight 
} from 'lucide-react';

export const UserDashboard = () => {
  const navigate = useNavigate();

  const [facilities, setFacilities] = useState([]);
  const [upcomingBooking, setUpcomingBooking] = useState(null);
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);

  const sportCategories = [
    { name: 'All Sports', icon: '⚽' },
    { name: 'Badminton', icon: '🏸' },
    { name: 'Football', icon: '⚽' },
    { name: 'Cricket', icon: '🏏' },
    { name: 'Tennis', icon: '🎾' },
    { name: 'Basketball', icon: '🏀' },
    { name: 'Table Tennis', icon: '🏓' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [facData, bkData, profData, anaData] = await Promise.all([
        userService.getFacilities(),
        userService.getUserBookings('Confirmed'),
        userService.getProfile(),
        userService.getAnalytics()
      ]);
      setFacilities(facData || []);
      setUpcomingBooking(bkData && bkData.length > 0 ? bkData[0] : null);
      setProfile(profData || null);
      setAnalytics(anaData || null);
    } catch (err) {
      console.error('Failed to load user dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filtered = await userService.getFacilities({
        location: selectedLocation,
        sport: selectedSport,
        maxPrice,
        minRating,
        date: selectedDate,
        time: selectedTime
      });
      setFacilities(filtered || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (facilityId) => {
    try {
      const target = facilities.find(f => f.id === facilityId);
      if (target?.isFavorite) {
        await userService.removeFavorite(facilityId);
      } else {
        await userService.addFavorite(facilityId);
      }
      setFacilities(prev => prev.map(f => f.id === facilityId ? { ...f, isFavorite: !f.isFavorite } : f));
    } catch (err) {
      console.error('Favorite toggle failed:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Top Banner & Profile Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Hero Banner (2 cols) */}
        <div className="lg:col-span-2 bg-slate-950 text-white rounded-2xl p-7 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="relative z-10 max-w-md space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
              Book Sports Facilities Near You
            </h1>
            <p className="text-xs text-slate-300">
              Find, book and play at the best sports venues in your city.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/user/facilities')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl px-5 py-2.5 shadow-md transition"
              >
                Explore Facilities
              </button>
            </div>
          </div>

          {/* Pagination Indicators */}
          <div className="flex items-center gap-1.5 pt-4 relative z-10">
            <span className="w-6 h-2 rounded-full bg-emerald-500"></span>
            <span className="w-2 h-2 rounded-full bg-slate-700"></span>
            <span className="w-2 h-2 rounded-full bg-slate-700"></span>
          </div>

          {/* Hero Sports Player Image */}
          <img
            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80"
            alt="Badminton Player"
            className="absolute right-0 top-0 h-full w-1/2 object-cover object-center opacity-85 pointer-events-none mask-gradient"
            style={{ maskImage: 'linear-gradient(to right, transparent, black)' }}
          />
        </div>

        {/* User Summary Card (1 col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <img
              src={profile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
              alt="Deepika R"
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/30 shrink-0"
            />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Hello, {profile?.name || 'Deepika'}! 👋</h3>
              <p className="text-xs text-slate-500">Ready to play today?</p>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 mt-4 text-center">
            <div>
              <span className="text-lg font-black text-slate-900 block">{analytics?.totalBookings || 12}</span>
              <span className="text-[11px] text-slate-400 font-medium">Bookings</span>
            </div>
            <div>
              <span className="text-lg font-black text-slate-900 block">3</span>
              <span className="text-[11px] text-slate-400 font-medium">Matches</span>
            </div>
            <div>
              <span className="text-lg font-black text-slate-900 block">8</span>
              <span className="text-[11px] text-slate-400 font-medium">Favorites</span>
            </div>
          </div>
        </div>
      </div>

      {/* "Find Your Game" Filter Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base">Find Your Game</h3>
          <button
            onClick={() => navigate('/user/facilities')}
            className="text-xs font-bold text-slate-600 hover:text-emerald-600 flex items-center gap-1"
          >
            Advanced Search <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Location Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Location</label>
            <div className="relative">
              <input
                type="text"
                value={selectedLocation === 'ALL' ? 'Chennai' : selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                placeholder="Select location"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-500"
              />
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Sport Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Sport</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
            >
              {sportCategories.map(s => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Date</label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-500"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Time Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Time</label>
            <div className="relative">
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select time</option>
                <option value="6:00 AM">6:00 AM - 9:00 AM (Morning)</option>
                <option value="4:00 PM">4:00 PM - 7:00 PM (Evening)</option>
                <option value="7:00 PM">7:00 PM - 10:00 PM (Night)</option>
              </select>
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Second Row: Price Slider & Rating Filters & Search Button */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Price Range Slider */}
          <div className="w-full md:w-64 space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Price Range (per hour)</span>
              <span className="text-emerald-600">₹100 - ₹{maxPrice}+</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Rating Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700">Ratings</span>
            {[
              { val: 4.5, label: '⭐ 4.5 & above' },
              { val: 4.0, label: '⭐ 4.0 & above' },
              { val: 3.0, label: '⭐ 3.0 & above' }
            ].map(r => (
              <button
                key={r.val}
                onClick={() => setMinRating(minRating === r.val ? 0 : r.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  minRating === r.val
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Emerald Search Button */}
          <button
            onClick={handleSearch}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl px-6 py-2.5 shadow-sm transition flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Search className="w-4 h-4" /> Search
          </button>
        </div>
      </div>

      {/* Sport Categories Horizontal Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {sportCategories.map((s) => {
          const isActive = selectedSport === s.name;
          return (
            <button
              key={s.name}
              onClick={() => {
                setSelectedSport(s.name);
                handleSearch();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
                isActive
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Facilities & Sidebar Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Main Column: Popular Facilities Near You (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">Popular Facilities Near You</h3>
            <button
              onClick={() => navigate('/user/facilities')}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
              <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span className="text-xs font-semibold">Loading facilities from API...</span>
            </div>
          ) : facilities.length === 0 ? (
            <div className="p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl space-y-2">
              <Trophy className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">No Facilities Found</h4>
              <p className="text-xs text-slate-500">Try broadening your search or resetting filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {facilities.map((fac) => (
                <FacilityCard
                  key={fac.id}
                  facility={fac}
                  onSelect={(f) => navigate('/user/facilities', { state: { selectedFacilityId: f.id } })}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Booking & Popular Sports (1 col) */}
        <div className="space-y-6">
          <UpcomingBookingCard booking={upcomingBooking} />
          <PopularSportsCard onSelectSport={(sport) => { setSelectedSport(sport); handleSearch(); }} />
        </div>
      </div>

      {/* Bottom Benefits Bar */}
      <BenefitsBar />
    </div>
  );
};

export default UserDashboard;
