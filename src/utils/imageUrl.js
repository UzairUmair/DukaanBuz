import imageAssets from './imageAssets.json';
import { API_ORIGIN } from '../api/client.js';

export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (imageAssets[url]) return imageAssets[url];
  if (/^https?:\/\//i.test(url)) return url;
  return API_ORIGIN + (url.startsWith('/') ? url : '/' + url);
};
