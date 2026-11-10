import PurchaseActions from '../components/cart/PurchaseActions.jsx';
import ThemeSurface from '../components/storefront/ThemeSurface.jsx';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPublicProduct, getPublicStore } from '../api/storeApi.js';
import ProductImage from '../components/common/ProductImage.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import StateMessage from '../components/common/StateMessage.jsx';
import { formatPKR } from '../utils/currency.js';

import ShopNav from '../components/storefront/ShopNav.jsx';
import './public-store.css';

export default function PublicProduct() { const { slug, id } = useParams(); const [product, setProduct] = useState(null); const [store, setStore] = useState(null); const [error, setError] = useState(''); useEffect(() => { Promise.all([getPublicProduct(slug, id), getPublicStore(slug)]).then(([nextProduct, nextStore]) => { setProduct(nextProduct); setStore(nextStore); }).catch((requestError) => setError(requestError.message)); }, [slug, id]); if (error) return <div className="container"><StateMessage title="Product not found" message={error} action={<Link className="btn" to={`/s/${slug}`}>Back to storefront</Link>} /></div>; if (!product || !store) return <LoadingState label="Loading product…" />; return <ThemeSurface store={store}><div className="product-detail"><ShopNav store={store}/><div className="container"><Link className="back-link" to={`/s/${slug}`}><ArrowLeft size={18} />{store.name} / Collection</Link><span className="detail-crumb"> / {product.title}</span><div className="product-detail__grid"><ProductImage product={product} className="product-detail__image" priority /><div><span className="edition-label">{store.name} / {product.category}</span><h1>{product.title}</h1><strong>{formatPKR(product.price)}</strong><p>{product.description || 'Ask the seller for more information about this product.'}</p><div className={product.stock > 0 ? 'availability' : 'availability is-out'}>{product.stock > 0 ? `${product.stock} currently available` : 'Currently out of stock'}</div><PurchaseActions product={product} slug={slug} detail/><aside className="seller-signature"><small>Sold by</small><b>{store.name}</b><span>{store.city}</span></aside><small>Submit an order request. The seller confirms availability before processing.</small></div></div></div></div></ThemeSurface>; }
