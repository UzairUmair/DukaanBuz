import api, { unwrap } from './client.js';

export const getProducts = async (params = {}) => unwrap(await api.get('/products', { params }));
export const getProduct = async (id) => unwrap(await api.get(`/products/${id}`));
export const createProduct = async (payload) => unwrap(await api.post('/products', payload));
export const updateProduct = async (id, payload) => unwrap(await api.put(`/products/${id}`, payload));
export const deleteProduct = async (id) => unwrap(await api.delete(`/products/${id}`));
export const uploadProductImage = async (id, image, onUploadProgress) => {
  const body = new FormData();
  body.append('image', image);
  return unwrap(await api.post(`/products/${id}/image`, body, { onUploadProgress }));
};
