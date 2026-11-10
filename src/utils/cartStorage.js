import { useSyncExternalStore } from 'react';
const prefix = 'dukaansaz_cart_';
const read = slug => {
  try { return window.localStorage.getItem(prefix + slug) || '[]'; } catch { return '[]'; }
};
const subscribe = notify => {
  window.addEventListener('storage', notify);
  window.addEventListener('cart-change', notify);
  return () => { window.removeEventListener('storage', notify); window.removeEventListener('cart-change', notify); };
};
export function readCart(slug) {
  try {
    const items = JSON.parse(read(slug));
    return Array.isArray(items) ? items.filter(item => typeof item.productId === 'string' && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99).slice(0,30) : [];
  } catch { return []; }
}
export function writeCart(slug, items) {
  window.localStorage.setItem(prefix + slug, JSON.stringify(items));
  window.dispatchEvent(new Event('cart-change'));
}
export function addCartItem(slug, product, quantity = 1) {
  const items = readCart(slug);
  const previous = items.find(item => item.productId === product.id);
  const next = (previous?.quantity || 0) + quantity;
  if (!product.isActive || next > Math.min(99, product.stock)) throw new Error('Requested quantity is unavailable.');
  if (!previous && items.length >= 30) throw new Error('Your cart can hold up to 30 products.');
  writeCart(slug, previous ? items.map(item => item === previous ? { ...item, quantity: next } : item) : [...items, { productId: product.id, quantity }]);
}
export function useCart(slug) {
  const snapshot = useSyncExternalStore(subscribe, () => read(slug));
  try { const value = JSON.parse(snapshot); return Array.isArray(value) ? value.filter(item => Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99 && typeof item.productId === 'string').slice(0,30) : []; } catch { return []; }
}
