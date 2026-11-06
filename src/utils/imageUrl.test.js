import { describe, expect, it } from 'vitest';
import { resolveImageUrl } from './imageUrl.js';

describe('resolveImageUrl', () => {
  it('keeps absolute URLs', () => expect(resolveImageUrl('https://images.example.com/product.jpg')).toBe('https://images.example.com/product.jpg'));
  it('resolves backend-relative image URLs', () => expect(resolveImageUrl('/uploads/products/item.png')).toContain('/uploads/products/item.png'));
  it('returns no URL when an image is absent', () => expect(resolveImageUrl('')).toBe(''));
});
