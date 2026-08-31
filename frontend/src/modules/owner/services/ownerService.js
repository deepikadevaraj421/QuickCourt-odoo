const API_BASE_URL = 'http://localhost:5000/api/owner';

async function request(endpoint, options = {}) {
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            ...options
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Owner API request failed');
        return data.data;
    } catch (err) {
        console.error(`Owner API Error [${endpoint}]:`, err);
        throw err;
    }
}

export const ownerService = {
    getDashboardSummary: () => request('/dashboard/summary'),
    getDashboardSchedule: () => request('/dashboard/schedule'),

    getFacilities: () => request('/facilities'),
    createFacility: (payload) => request('/facilities', { method: 'POST', body: JSON.stringify(payload) }),
    updateFacility: (id, payload) => request(`/facilities/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

    getCourts: () => request('/courts'),
    createCourt: (payload) => request('/courts', { method: 'POST', body: JSON.stringify(payload) }),
    updateCourt: (facilityId, courtId, payload) => request(`/courts/${facilityId}/${courtId}`, { method: 'PUT', body: JSON.stringify(payload) }),
    deleteCourt: (facilityId, courtId) => request(`/courts/${facilityId}/${courtId}`, { method: 'DELETE' }),

    getAvailability: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/availability${query ? `?${query}` : ''}`);
    },
    blockAvailability: (payload) => request('/availability/block', { method: 'POST', body: JSON.stringify(payload) }),
    unblockAvailability: (id) => request(`/availability/block/${id}`, { method: 'DELETE' }),

    getBookings: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/bookings${query ? `?${query}` : ''}`);
    },

    getEarningsSummary: () => request('/earnings/summary'),

    getReviews: () => request('/reviews'),

    getNotifications: () => request('/notifications'),
    markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),

    getAnalytics: () => request('/analytics'),

    getProfile: () => request('/profile'),
    updateProfile: (payload) => request('/profile', { method: 'PUT', body: JSON.stringify(payload) })
};

export default ownerService;
