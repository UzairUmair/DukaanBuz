import { Image as ImageIcon } from 'lucide-react';
import { resolveImageUrl } from '../../utils/imageUrl.js';
import './common.css';
export default function ProductImage({ product, className = '', priority = false }) { const src = resolveImageUrl(product?.imageUrl); return <div className={`product-image ${className}`}>{src ? <img src={src} alt={product.title} width="640" height="640" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} /> : <div className="product-image__empty"><ImageIcon aria-hidden="true" /><span>No image uploaded</span></div>}</div>; }
