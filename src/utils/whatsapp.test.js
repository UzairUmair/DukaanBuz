import { describe, expect, it } from 'vitest';
import { whatsappUrl } from './whatsapp.js';

describe('whatsappUrl', () => {
  it('normalizes the number and encodes the product inquiry', () => {
    const url = whatsappUrl({ number: '+92 300 1234567', product: 'Canvas tote', price: 'Rs. 1,800', link: 'https://store.example/p/1' });
    expect(url).toContain('wa.me/923001234567');
    expect(url).toContain(encodeURIComponent('Canvas tote'));
  });
});
