import api, { unwrap } from './client.js';

export const registerUser = async (payload) => unwrap(await api.post('/auth/register', payload));
export const loginUser = async (payload) => unwrap(await api.post('/auth/login', payload));
export const getCurrentUser = async () => unwrap(await api.get('/auth/me'));
