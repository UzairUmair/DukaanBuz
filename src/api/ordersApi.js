import api, { unwrap } from './client.js';
export const placeOrder = (slug, body) => api.post('/public/stores/'+encodeURIComponent(slug)+'/orders', body).then(unwrap);
export const getOrders = params => api.get('/orders', { params }).then(unwrap);
export const getOrder = id => api.get('/orders/'+id).then(unwrap);
export const getOrderStats = () => api.get('/orders/stats').then(unwrap);
export const updateOrderStatus = (id, status) => api.put('/orders/'+id+'/status', { status }).then(unwrap);
