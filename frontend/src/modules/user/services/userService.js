// Frontend Service connecting to Backend REST APIs for Member 1 (User Module)

const API_BASE_URL = 'http://localhost:5000/api/user';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API request failed');
    return data.data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const userService = {
  // Facilities
  getFacilities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/facilities${query ? `?${query}` : ''}`);
  },

  getFacilityById: (id) => request(`/facilities/${id}`),

  getCourtsByFacilityId: (facilityId) => request(`/facilities/${facilityId}/courts`),

  getCourtSlots: (courtId, date) => request(`/courts/${courtId}/slots?date=${date}`),

  // Bookings
  createBooking: (bookingData) =>
    request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    }),

  getUserBookings: (status) => request(`/bookings${status ? `?status=${status}` : ''}`),

  cancelBooking: (id) =>
    request(`/bookings/${id}/cancel`, {
      method: 'PATCH'
    }),

  // Favorites
  getUserFavorites: () => request('/favorites'),

  addFavorite: (facilityId) =>
    request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ facilityId })
    }),

  removeFavorite: (facilityId) =>
    request(`/favorites/${facilityId}`, {
      method: 'DELETE'
    }),

  // Matches
  getMatches: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/matches${query ? `?${query}` : ''}`);
  },

  createMatch: (matchData) =>
    request('/matches', {
      method: 'POST',
      body: JSON.stringify(matchData)
    }),

  joinMatch: (matchId) =>
    request(`/matches/${matchId}/join`, {
      method: 'POST'
    }),

  getUserMatches: () => request('/matches/my-matches'),

  // Reviews
  getFacilityReviews: (facilityId) => request(`/facilities/${facilityId}/reviews`),

  addReview: (reviewData) =>
    request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    }),

  // Notifications
  getNotifications: () => request('/notifications'),

  markNotificationRead: (id) =>
    request(`/notifications/${id}/read`, {
      method: 'PATCH'
    }),

  // Analytics, Profile, Payments
  getAnalytics: () => request('/analytics'),

  getProfile: () => request('/profile'),

  updateProfile: (profileData) =>
    request('/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData)
    }),

  getPayments: () => request('/payments')
};

export default userService;
