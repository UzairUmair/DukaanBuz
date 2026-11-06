import { API_ORIGIN } from '../api/client.js';
export const resolveImageUrl = (url) => !url ? '' : /^https?:\/\//i.test(url) ? url : `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
