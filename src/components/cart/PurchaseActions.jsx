import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { addCartItem } from '../../utils/cartStorage.js';

export default function PurchaseActions({ product, slug, detail = false }) {
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const available = product.isActive !== false && product.stock > 0;
  function add() {
    try { addCartItem(slug, product, quantity); setMessage('Added to your cart.'); }
    catch (error) { setMessage(error.message); }
  }
  return <div className="purchase-actions">
    {detail && <label>Quantity<input aria-label="Product quantity" type="number" min="1" max={Math.min(99, product.stock)} value={quantity} onChange={event => setQuantity(Math.max(1, Math.min(99, Number(event.target.value) || 1)))}/></label>}
    <button className="btn" type="button" disabled={!available || quantity > product.stock} onClick={add}><ShoppingBag size={17}/>{available ? 'Add to Cart' : 'Out of stock'}</button>
    {detail && <button className="btn btn--quiet" type="button" disabled={!available || quantity > product.stock} onClick={() => navigate('/s/'+slug+'/checkout?buy='+product.id+'&quantity='+quantity)}>Buy Now</button>}
    <small role="status">{message}</small>
  </div>;
}
