import axios from 'axios';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://dukaanbuz-backend.vercel.app/api').replace(/\/$/, '');
export const API_ORIGIN = new URL(API_BASE_URL).origin;
const TOKEN_KEY = 'dukaansaz_session';

export const getStoredToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setStoredToken = (token) => sessionStorage.setItem(TOKEN_KEY, token);
export const clearStoredToken = () => sessionStorage.removeItem(TOKEN_KEY);

const api = axios.create({ baseURL: API_BASE_URL, timeout: 20000 });

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = new Error(
      error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'The server took too long to respond.' : 'Unable to connect to the server.')
    );
    normalized.status = error.response?.status || 0;
    normalized.errors = error.response?.data?.errors || [];
    normalized.original = error;
    if (normalized.status === 401 && getStoredToken()) {
      clearStoredToken();
      window.dispatchEvent(new Event('dukaansaz:unauthorized'));
    }
    return Promise.reject(normalized);
  }
);

export const unwrap = (response) => response.data.data;
export default api;
