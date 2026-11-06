import api, { unwrap } from './client.js';

export const getDashboardStats = async () => unwrap(await api.get('/dashboard/stats'));
