// Single API client shared by auth, user, owner and admin modules.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'quickcourt_token';
export const AUTH_EVENT = 'quickcourt:unauthorized';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY)
};

export function authHeaders() {
  const token = tokenStorage.get();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export class ApiError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest(path, options = {}) {
  const { headers, ...rest } = options;
  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(headers || {}) },
      ...rest
    });
  } catch {
    throw new ApiError(0, 'Unable to reach the server. Please check your connection.', 'NETWORK_ERROR');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    if (res.status === 401 && tokenStorage.get()) {
      tokenStorage.clear();
      window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: data }));
    }
    throw new ApiError(res.status, data?.message || `Request failed (${res.status})`, data?.code);
  }
  return data?.data;
}
