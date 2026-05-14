export function saveAuth(token, user) {
  localStorage.setItem('getfrench-kids_token', token);
  localStorage.setItem('getfrench-kids_user', JSON.stringify(user));
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('getfrench-kids_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem('getfrench-kids_token');
}

export function clearAuth() {
  localStorage.removeItem('getfrench-kids_token');
  localStorage.removeItem('getfrench-kids_user');
  localStorage.removeItem('getfrench-kids_speed');
  localStorage.removeItem('getfrench-kids_lang');
  localStorage.removeItem('getfrench-kids_profile');
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
