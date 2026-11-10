import PurchaseActions from '../cart/PurchaseActions.jsx';
import { Link } from 'react-router-dom';
import ProductImage from '../common/ProductImage.jsx';
import { formatPKR } from '../../utils/currency.js';
import './storefront.css';
export default function ProductCard({ product, slug }) { return <article className="store-product-card"><Link to={`/s/${slug}/p/${product.id}`}><ProductImage product={product} /><div><span>{product.category}</span><h3>{product.title}</h3><strong>{formatPKR(product.price)}</strong><small className="retail-stock">{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</small></div></Link><PurchaseActions product={product} slug={slug}/></article>; }
