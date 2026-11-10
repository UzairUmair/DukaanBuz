import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getPublicProducts, getPublicStore } from '../api/storeApi.js';
import { placeOrder } from '../api/ordersApi.js';
import { readCart, useCart, writeCart } from '../utils/cartStorage.js';
import ThemeSurface from '../components/storefront/ThemeSurface.jsx';
import ShopNav from '../components/storefront/ShopNav.jsx';
import ProductImage from '../components/common/ProductImage.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import { formatPKR } from '../utils/currency.js';
import './commerce.css';

export default function ShoppingCart({ checkout = false, success = false }) {
  const { slug } = useParams();
  const cart = useCart(slug);
  const [query] = useSearchParams();
  const [store, setStore] = useState(null), [products, setProducts] = useState([]), [error,setError] = useState(''), [loading,setLoading] = useState(true), [busy,setBusy] = useState(false);
  const [customer,setCustomer] = useState({name:'',phone:'',city:'',address:'',notes:''});
  const submission = useRef(null), lock = useRef(false);
  const navigate = useNavigate(), location = useLocation();
  useEffect(() => {
    let live = true;
    Promise.all([getPublicStore(slug),getPublicProducts(slug)]).then(([s,p])=>{if(live){setStore(s);setProducts(p);setError('');}}).catch(e=>{if(live)setError(e.message);}).finally(()=>{if(live)setLoading(false);});
    return ()=>{live=false;};
  },[slug]);
  const buying = checkout && Boolean(query.get('buy'));
  const items = buying ? [{productId:query.get('buy'),quantity:Number(query.get('quantity') || 1)}] : cart;
  const rows = items.map(item=>({...item,product:products.find(p=>p.id===item.productId)}));
  const valid = rows.length > 0 && rows.every(row=>row.product && Number.isInteger(row.quantity) && row.quantity > 0 && row.quantity <= Math.min(99,row.product.stock));
  const total = rows.reduce((sum,row)=>sum+(row.product?Math.round(row.product.price*100)*row.quantity:0),0)/100;
  function quantity(id, next) {
    try { writeCart(slug,cart.map(item=>item.productId===id?{...item,quantity:next}:item)); }
    catch { setError('Cart storage is unavailable. Enable browser storage to continue.'); }
  }
  function remove(id) { try { writeCart(slug,cart.filter(item=>item.productId!==id)); } catch { setError('Could not update your cart.'); } }
  async function submit(event) {
    event.preventDefault();
    if (lock.current || !valid) return;
    lock.current=true;setBusy(true);setError('');
    const body={customer,items:items.map(({productId,quantity})=>({productId,quantity}))};
    try {
    const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(body)));
    const signature=Array.from(new Uint8Array(bytes),v=>v.toString(16).padStart(2,'0')).join('');
    if(submission.current?.signature!==signature){
      let previous;
      try { previous=JSON.parse(sessionStorage.getItem('dukaansaz_checkout_'+slug)); } catch { previous=null; }
      submission.current=previous?.signature===signature?previous:{signature,key:crypto.randomUUID()};
      try { sessionStorage.setItem('dukaansaz_checkout_'+slug,JSON.stringify(submission.current)); } catch { /* In-memory retry protection remains available. */ }
    }
      const receipt=await placeOrder(slug,{...body,idempotencyKey:submission.current.key});
      try { sessionStorage.removeItem('dukaansaz_checkout_'+slug); } catch { /* Receipt is already persisted. */ }
      if(!buying) {
        const submitted=new Map(items.map(item=>[item.productId,item.quantity]));
        try { writeCart(slug,readCart(slug).map(item=>({...item,quantity:item.quantity-(submitted.get(item.productId)||0)})).filter(item=>item.quantity>0)); } catch { /* The persisted receipt remains the source of success. */ }
      }
      navigate('/s/'+slug+'/order-success',{replace:true,state:{receipt}});
    } catch(e) {setError(e.message);} finally {lock.current=false;setBusy(false);}
  }
  if(loading || (store && store.slug !== slug))return <LoadingState label="Opening your shopping bag…"/>;
  if(!store)return <div className="container"><p role="alert">{error}</p><Link to={'/s/'+slug}>Return to store</Link></div>;
  const receipt=location.state?.receipt;
  return <ThemeSurface store={store}><ShopNav store={store}/><div className="commerce-page container">
    {success ? <section className="order-receipt"><h1>{receipt?'Your order request has been received!':'Order confirmation'}</h1>{receipt?<><strong>{receipt.orderNumber}</strong><p>{store.name} will review your request. Status · {receipt.status}</p></>:<p>Your confirmation appears here after a successful checkout.</p>}<Link className="btn" to={'/s/'+slug}>Back to Store</Link></section>:
    <><header><p>{store.name}</p><h1>{checkout?'Checkout':'Your shopping bag'}</h1><Link to={'/s/'+slug+'/catalog'}>Continue shopping</Link></header>
    {error&&<p role="alert" className="alert alert--error">{error}</p>}
    {!rows.length?<section className="order-receipt"><h2>Your cart is empty.</h2><p>Explore the collection and add something you love.</p><Link className="btn" to={'/s/'+slug+'/catalog'}>Continue Shopping</Link></section>:
    <div className="commerce-grid">{checkout&&<form id="checkout-form" className="checkout-form" onSubmit={submit}><h2>Customer details</h2>
      {[['name','Full name',true,80],['phone','Contact phone number',true,24],['city','City',false,80],['address','Delivery address',false,500],['notes','Additional instructions',false,1000]].map(([field,label,required,max])=><label className="form-field" key={field}>{label}{required?' *':' (optional)'}<input name={field} type={field==='phone'?'tel':'text'} autoComplete={({name:'name',phone:'tel',city:'address-level2',address:'street-address'})[field] || 'off'} required={required} maxLength={max} value={customer[field]} onChange={e=>setCustomer({...customer,[field]:e.target.value})}/></label>)}
      <p>Your order request will be sent to the seller for confirmation. No payment is collected online.</p></form>}
      <div className={checkout?"checkout-review":"cart-review"}><section className="cart-items" aria-label="Order items">{rows.map(row=><article key={row.productId} className="cart-row">{row.product?<ProductImage product={row.product}/>:<span>Unavailable</span>}<div><h2>{row.product?.title || 'Product no longer available'}</h2>{row.product&&<p>{formatPKR(row.product.price)} each</p>}{!row.product || row.quantity>row.product.stock ? <p role="alert">Update or remove this item before checkout.</p>:null}
      {checkout?<p>Quantity · {row.quantity}</p>:<div className="quantity-controls"><button aria-label={'Decrease '+row.product?.title} disabled={row.quantity<=1} onClick={()=>quantity(row.productId,row.quantity-1)}>−</button><span>{row.quantity}</span><button aria-label={'Increase '+row.product?.title} disabled={!row.product||row.quantity>=Math.min(99,row.product.stock)} onClick={()=>quantity(row.productId,row.quantity+1)}>+</button><button onClick={()=>remove(row.productId)}>Remove</button></div>}</div><strong>{row.product?formatPKR(row.product.price*row.quantity):'—'}</strong></article>)}</section>
      <aside className="cart-summary"><h2>Order summary</h2><p>Product subtotal <strong>{formatPKR(total)}</strong></p><p>Total product cost <strong>{formatPKR(total)}</strong></p><small>Delivery arrangements and any delivery charges will be confirmed by the seller.</small>{checkout?<button form="checkout-form" className="btn" type="submit" disabled={busy||!valid}>{busy?'Sending request…':'Place Order'}</button>:<Link className="btn" aria-disabled={!valid} onClick={e=>!valid&&e.preventDefault()} to={'/s/'+slug+'/checkout'}>Proceed to checkout</Link>}{!valid&&<p>Some products are unavailable or have insufficient stock.</p>}{checkout&&<Link to={'/s/'+slug+'/cart'}>Review cart</Link>}</aside></div>
    </div>}</>}
  </div></ThemeSurface>;
}
