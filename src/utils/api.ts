export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
export const SOCKET_BASE = import.meta.env.VITE_SOCKET_URL || window.location.origin;
export const AUTH_TOKEN_KEY = 'norvic_auth_token';

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error || 'Request failed');
  }

  return response.json() as Promise<T>;
}
