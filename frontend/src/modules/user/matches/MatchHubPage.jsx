import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { 
  Users, Plus, Calendar, Clock, MapPin, CheckCircle, X, Search, Sparkles, Filter, Shield 
} from 'lucide-react';

export const MatchHubPage = ({ myMatchesOnly = false }) => {
  const [matches, setMatches] = useState([]);
  const [recommendedMatches, setRecommendedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Search & Filter state
  const [sportFilter, setSportFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('ALL');

  // Create match modal form state
  const [form, setForm] = useState({
    title: '',
    sport: 'Badminton',
    facilityName: 'PlayZone Arena',
    location: 'Anna Nagar, Chennai',
    date: new Date().toISOString().split('T')[0],
    time: '6:00 PM',
    skillLevel: 'Intermediate',
    requiredPlayers: 4
  });

  useEffect(() => {
    fetchMatches();
  }, [myMatchesOnly]);

  const fetchMatches = async (customParams = {}) => {
    setLoading(true);
    try {
      if (myMatchesOnly) {
        const data = await userService.getUserMatches();
        setMatches(data || []);
        setRecommendedMatches([]);
      } else {
        const allData = await userService.getMatches(customParams);
        setMatches(allData || []);
        // Recommended matches are open matches with isRecommended flag or active slots
        setRecommendedMatches((allData || []).filter(m => m.isRecommended || m.joinedUsers?.length > 1));
      }
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchMatches({
      sport: sportFilter,
      location: locationFilter,
      date: dateFilter,
      skillLevel: skillFilter
    });
  };

  const handleJoin = async (matchId) => {
    try {
      await userService.joinMatch(matchId);
      fetchMatches();
    } catch (err) {
      alert(err.message || 'Failed to join match');
    }
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    try {
      await userService.createMatch(form);
      setShowCreateModal(false);
      fetchMatches();
    } catch (err) {
      alert(err.message || 'Failed to create match');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER SECTION
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {myMatchesOnly ? 'My Joined & Hosted Matches' : 'Match Hub'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Find players, join games and play together</p>
        </div>

        {!myMatchesOnly && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl px-5 py-2.5 shadow-sm transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Match
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. RECOMMENDED FOR YOU SECTION (Only in public Match Hub)
          ───────────────────────────────────────────────────────────── */}
      {!myMatchesOnly && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧠</span>
            <h3 className="font-extrabold text-slate-900 text-base">Recommended For You</h3>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
              Based on your sports preferences
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedMatches.slice(0, 3).map((m) => {
              const isJoined = m.joinedUsers?.includes('usr_deepika');
              return (
                <div
                  key={`rec_${m.id}`}
                  className="bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-extrabold rounded-md uppercase">
                        {m.sport}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                        {m.skillLevel || 'Intermediate'}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm line-clamp-1">{m.title}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {m.facilityName}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" /> {m.date} • {m.time}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">
                      👥 {m.currentPlayers}/{m.requiredPlayers} players
                    </span>

                    {isJoined ? (
                      <span className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Joined
                      </span>
                    ) : (
                      <button
                        onClick={() => handleJoin(m.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg px-3 py-1.5 shadow-xs transition"
                      >
                        Join Match
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. FIND A MATCH FILTER SECTION
          ───────────────────────────────────────────────────────────── */}
      {!myMatchesOnly && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔍</span>
            <h3 className="font-extrabold text-slate-900 text-base">Find a Match</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Sport Selector */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-slate-400">Sport</label>
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Sports</option>
                <option value="Badminton">Badminton</option>
                <option value="Football">Football</option>
                <option value="Tennis">Tennis</option>
                <option value="Cricket">Cricket</option>
                <option value="Basketball">Basketball</option>
              </select>
            </div>

            {/* Location Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-slate-400">Location</label>
              <div className="relative">
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="e.g. Chennai or Velachery"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:border-emerald-500"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Date Picker */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-slate-400">Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Skill Level Selector */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase text-slate-400">Skill Level</label>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Skills</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex flex-col justify-end">
              <button
                onClick={handleSearch}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl px-4 py-2.5 shadow-sm transition flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. AVAILABLE MATCHES SECTION
          ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌍</span>
          <h3 className="font-extrabold text-slate-900 text-base">
            {myMatchesOnly ? 'Your Matches' : 'Available Matches'}
          </h3>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <span className="text-xs font-bold text-slate-600">Loading matches from backend API...</span>
          </div>
        ) : matches.length === 0 ? (
          <div className="p-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-slate-800 text-base">No Matches Available</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">Try adjusting your filters or click "+ Create Match" to start a game.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((m) => {
              const isJoined = m.joinedUsers?.includes('usr_deepika');
              return (
                <div key={m.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-md uppercase">
                          {m.sport}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md">
                          {m.skillLevel || 'Intermediate'}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        Host: <span className="font-bold text-slate-800">{m.creatorName}</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base">{m.title}</h3>

                    <div className="space-y-1 text-xs text-slate-500">
                      <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {m.facilityName} ({m.location})</p>
                      <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {m.date} at {m.time}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span className="font-extrabold text-slate-900">{m.currentPlayers} / {m.requiredPlayers}</span>
                      <span className="text-slate-400 font-medium">players joined</span>
                    </div>

                    {isJoined ? (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Joined
                      </span>
                    ) : (
                      <button
                        disabled={m.currentPlayers >= m.requiredPlayers}
                        onClick={() => handleJoin(m.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-4 py-2 shadow-xs transition disabled:opacity-50"
                      >
                        {m.currentPlayers >= m.requiredPlayers ? 'Full' : 'Join Match'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. CREATE MATCH MODAL
          ───────────────────────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Host New Match</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMatch} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Match Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Friendly Badminton Doubles"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Sport</label>
                  <select
                    value={form.sport}
                    onChange={(e) => setForm({ ...form, sport: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Badminton">Badminton</option>
                    <option value="Football">Football</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Basketball">Basketball</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Skill Level</label>
                  <select
                    value={form.skillLevel}
                    onChange={(e) => setForm({ ...form, skillLevel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All Skills">All Skills</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Max Players</label>
                  <input
                    type="number"
                    min="2"
                    max="22"
                    value={form.requiredPlayers}
                    onChange={(e) => setForm({ ...form, requiredPlayers: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Time</label>
                <input
                  type="text"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="6:00 PM"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl px-5 py-2.5 shadow-sm"
                >
                  Publish Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchHubPage;
