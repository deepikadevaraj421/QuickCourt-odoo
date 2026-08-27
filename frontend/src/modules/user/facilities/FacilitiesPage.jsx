import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import userService from '../services/userService';
import FacilityCard from '../components/FacilityCard';
import { Search, MapPin, Calendar, Clock, X, CheckCircle, ShieldCheck, Heart } from 'lucide-react';

export const FacilitiesPage = () => {
  const location = useLocation();

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);

  // Facility Detail Modal State
  const [activeFacility, setActiveFacility] = useState(null);
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    fetchFacilities();
  }, [search, sportFilter, maxPrice, minRating]);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const data = await userService.getFacilities({
        search,
        sport: sportFilter,
        maxPrice,
        minRating
      });
      setFacilities(data || []);

      // If redirected with a specific selectedFacilityId
      if (location.state?.selectedFacilityId && data) {
        const found = data.find(f => f.id === location.state.selectedFacilityId);
        if (found) openFacilityDetails(found);
      }
    } catch (err) {
      console.error('Failed to load facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  const openFacilityDetails = async (fac) => {
    setActiveFacility(fac);
    setBookingSuccess(null);
    setBookingError('');
    try {
      const crts = await userService.getCourtsByFacilityId(fac.id);
      setCourts(crts || []);
      if (crts && crts.length > 0) {
        setSelectedCourt(crts[0]);
        loadSlots(crts[0].id, bookingDate);
      }
    } catch (err) {
      console.error('Failed to load courts:', err);
    }
  };

  const loadSlots = async (courtId, date) => {
    try {
      const availSlots = await userService.getCourtSlots(courtId, date);
      setSlots(availSlots || []);
      const availableOne = availSlots.find(s => s.isAvailable);
      setSelectedSlot(availableOne ? availableOne.timeSlot : '');
    } catch (err) {
      console.error('Failed to load slots:', err);
    }
  };

  const handleCourtSelect = (court) => {
    setSelectedCourt(court);
    loadSlots(court.id, bookingDate);
  };

  const handleDateChange = (date) => {
    setBookingDate(date);
    if (selectedCourt) loadSlots(selectedCourt.id, date);
  };

  const handleConfirmBooking = async () => {
    if (!selectedCourt || !selectedSlot) {
      setBookingError('Please select a valid court and available time slot.');
      return;
    }
    setBookingError('');

    try {
      const result = await userService.createBooking({
        facilityId: activeFacility.id,
        courtId: selectedCourt.id,
        date: bookingDate,
        timeSlot: selectedSlot
      });
      setBookingSuccess(result);
      fetchFacilities();
    } catch (err) {
      setBookingError(err.message || 'Failed to create booking.');
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
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Explore Sports Facilities</h2>
        <p className="text-xs text-slate-500 mt-0.5">Book verified courts and arenas with instant confirmation.</p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venue or city..."
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Sport Filter */}
        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Sports</option>
          <option value="Badminton">Badminton</option>
          <option value="Tennis">Tennis</option>
          <option value="Football">Football</option>
          <option value="Cricket">Cricket</option>
          <option value="Basketball">Basketball</option>
          <option value="Table Tennis">Table Tennis</option>
        </select>

        {/* Price Filter */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Max Price:</span>
          <span className="text-xs font-bold text-emerald-600">₹{maxPrice}</span>
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>

        {/* Rating Filter */}
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
        >
          <option value={0}>Any Rating</option>
          <option value={4.5}>⭐ 4.5 & above</option>
          <option value={4.0}>⭐ 4.0 & above</option>
        </select>
      </div>

      {/* Facilities List */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Loading facilities from backend API...</span>
        </div>
      ) : facilities.length === 0 ? (
        <div className="p-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl space-y-2">
          <h3 className="font-extrabold text-slate-800 text-base">No Facilities Match Your Filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Try clearing search parameters or adjusting price range slider.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facilities.map((fac) => (
            <FacilityCard
              key={fac.id}
              facility={fac}
              onSelect={openFacilityDetails}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Facility Details & Booking Modal */}
      {activeFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">{activeFacility.name}</h3>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-md">
                  Verified Venue
                </span>
              </div>
              <button
                onClick={() => setActiveFacility(null)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {bookingSuccess ? (
                <div className="p-8 text-center space-y-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900">Booking Confirmed!</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Your booking at <span className="font-bold text-slate-900">{bookingSuccess.facilityName}</span> ({bookingSuccess.courtName}) for <span className="font-bold text-slate-900">{bookingSuccess.date}</span> at <span className="font-bold text-slate-900">{bookingSuccess.timeSlot}</span> has been created.
                  </p>
                  <button
                    onClick={() => setActiveFacility(null)}
                    className="bg-emerald-600 text-white font-bold text-xs rounded-xl px-6 py-2.5 shadow-sm"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Image & Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <img
                      src={activeFacility.image}
                      alt={activeFacility.name}
                      className="w-full h-36 object-cover rounded-xl border border-slate-100 sm:col-span-1"
                    />
                    <div className="sm:col-span-2 space-y-2">
                      <p className="text-xs text-slate-600 leading-relaxed">{activeFacility.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {activeFacility.amenities.map(a => (
                          <span key={a} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                            • {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 1: Select Court */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">1. Select Court</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {courts.map(c => (
                        <button
                          key={c.id}
                          onClick={() => handleCourtSelect(c)}
                          className={`p-3 rounded-xl border text-left transition ${
                            selectedCourt?.id === c.id
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-bold text-xs block">{c.name}</span>
                          <span className="text-[11px] font-semibold text-emerald-600">₹{c.pricePerHour} / hr</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Select Date & Slot */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Select Date & Slot</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1 text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {slots.map(s => (
                        <button
                          key={s.timeSlot}
                          disabled={!s.isAvailable}
                          onClick={() => setSelectedSlot(s.timeSlot)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                            !s.isAvailable
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                              : selectedSlot === s.timeSlot
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {s.timeSlot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {bookingError && (
                    <p className="text-xs text-rose-500 font-bold bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                      {bookingError}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            {!bookingSuccess && (
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                  <span className="text-lg font-black text-slate-900">₹{selectedCourt?.pricePerHour || activeFacility.startingPrice}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveFacility(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl px-6 py-2.5 shadow-sm transition"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;
