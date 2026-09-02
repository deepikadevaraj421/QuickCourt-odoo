import { apiRequest } from '../../shared/api/client';

const post = (path, body) => apiRequest(path, { method: 'POST', body: JSON.stringify(body) });

export const authService = {
  register: ({ name, email, password, role }) => post('/auth/register', { name, email, password, role }),
  verifyOtp: ({ email, otp }) => post('/auth/verify-otp', { email, otp }),
  resendOtp: ({ email }) => post('/auth/resend-otp', { email }),
  login: ({ email, password }) => post('/auth/login', { email, password }),
  me: () => apiRequest('/auth/me'),
  logout: () => apiRequest('/auth/logout', { method: 'POST' })
};

export default authService;
