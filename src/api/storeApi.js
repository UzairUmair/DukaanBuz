import api, { unwrap } from './client.js';

export const getMyStore = async () => unwrap(await api.get('/stores/me'));
export const createStore = async (payload) => unwrap(await api.post('/stores', payload));
export const updateStore = async (payload) => unwrap(await api.put('/stores/me', payload));
export const getPublicStore = async (slug) => unwrap(await api.get(`/public/stores/${encodeURIComponent(slug)}`));
export const getPublicProducts = async (slug, params = {}) => unwrap(await api.get(`/public/stores/${encodeURIComponent(slug)}/products`, { params }));
export const getPublicProduct = async (slug, id) => unwrap(await api.get(`/public/stores/${encodeURIComponent(slug)}/products/${encodeURIComponent(id)}`));
