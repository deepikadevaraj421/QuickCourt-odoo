export const ROLES = {
  USER: 'USER',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN'
};

export const ROLE_HOME = {
  USER: '/user',
  OWNER: '/owner/dashboard',
  ADMIN: '/admin/dashboard'
};

export function homeForRole(role) {
  return ROLE_HOME[role] || '/login';
}
