const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email?.trim()) return 'Email is required';
  if (!EMAIL_RE.test(email.trim())) return 'Enter a valid email address';
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Use at least one letter and one number';
  return '';
}

export function validateName(name) {
  if (!name?.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
}

export function validateOtp(otp) {
  if (!otp) return 'Enter the 6-digit code';
  if (!/^\d{6}$/.test(otp)) return 'Code must be exactly 6 digits';
  return '';
}
