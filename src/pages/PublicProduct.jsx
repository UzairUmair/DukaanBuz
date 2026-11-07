import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { getPublicProduct, getPublicStore } from '../api/storeApi.js';
import ProductImage from '../components/common/ProductImage.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import StateMessage from '../components/common/StateMessage.jsx';
import { formatPKR } from '../utils/currency.js';
import { whatsappUrl } from '../utils/whatsapp.js';
import './public-store.css';

export default function PublicProduct() { const { slug, id } = useParams(); const [product, setProduct] = useState(null); const [store, setStore] = useState(null); const [error, setError] = useState(''); useEffect(() => { Promise.all([getPublicProduct(slug, id), getPublicStore(slug)]).then(([nextProduct, nextStore]) => { setProduct(nextProduct); setStore(nextStore); }).catch((requestError) => setError(requestError.message)); }, [slug, id]); if (error) return <div className="container"><StateMessage title="Product not found" message={error} action={<Link className="btn" to={`/s/${slug}`}>Back to storefront</Link>} /></div>; if (!product || !store) return <LoadingState label="Loading product…" />; const url = whatsappUrl({ number: store.whatsappNumber, product: product.title, price: formatPKR(product.price), link: window.location.href }); return <div className="product-detail"><div className="container"><Link className="back-link" to={`/s/${slug}`}><ArrowLeft size={18} />Back to {store.name}</Link><div className="product-detail__grid"><ProductImage product={product} className="product-detail__image" priority /><div><span className="edition-label">{store.name} / {product.category}</span><h1>{product.title}</h1><strong>{formatPKR(product.price)}</strong><p>{product.description || 'Ask the seller for more information about this product.'}</p><div className={product.stock > 0 ? 'availability' : 'availability is-out'}>{product.stock > 0 ? `${product.stock} currently available` : 'Currently out of stock'}</div><a className="btn" href={url} target="_blank" rel="noreferrer"><MessageCircle size={18} />Ask on WhatsApp</a><small>WhatsApp opens with a prefilled inquiry. You decide whether to send it.</small></div></div></div></div>; }
