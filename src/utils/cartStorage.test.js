import { beforeEach, expect, test } from 'vitest';
import { addCartItem, readCart, writeCart } from './cartStorage.js';

beforeEach(() => {
  const values = new Map();
  Object.defineProperty(window, 'localStorage', { configurable: true, value: {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    clear: () => values.clear(),
  } });
});
const product = { id: 'product-a', stock: 4, isActive: true };
test('guest carts persist IDs and quantities separately for each store', () => {
  addCartItem('store-a', product, 2);
  addCartItem('store-b', { ...product, id: 'product-b' });
  expect(readCart('store-a')).toEqual([{ productId: 'product-a', quantity: 2 }]);
  expect(readCart('store-b')).toEqual([{ productId: 'product-b', quantity: 1 }]);
  expect(JSON.parse(window.localStorage.getItem('dukaansaz_cart_store-a'))[0]).not.toHaveProperty('price');
});
test('cart stock limits reject repeated additions without corrupting the previous cart', () => {
  addCartItem('store-a', product, 3);
  expect(() => addCartItem('store-a', product, 2)).toThrow();
  expect(readCart('store-a')[0].quantity).toBe(3);
});
test('invalid browser storage recovers to an empty cart', () => {
  window.localStorage.setItem('dukaansaz_cart_store-a', '{broken');
  expect(readCart('store-a')).toEqual([]);
  writeCart('store-a', []);
  expect(readCart('store-a')).toEqual([]);
});
