import { apiRequest } from '../../../shared/api/client';

const request = (endpoint, options) => apiRequest(`/admin${endpoint}`, options);

export const adminService = {
  getSummary: () => request('/summary'),
  getAccounts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/accounts${query ? `?${query}` : ''}`);
  },
  updateAccountRole: (id, role) => request(`/accounts/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  deleteAccount: (id) => request(`/accounts/${id}`, { method: 'DELETE' }),
  getFacilities: () => request('/facilities')
};

export default adminService;
