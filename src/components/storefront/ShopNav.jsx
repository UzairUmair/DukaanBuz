import { useCart } from '../../utils/cartStorage.js';
import { ShoppingBag } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { Store } from 'lucide-react';

export default function ShopNav({ store }) {
  const cart = useCart(store.slug);
  const root = '/s/' + store.slug;
  const appearance = store.appearance || {};
  const order = appearance.navigationOrder === 'story-first'
    ? ['Home', 'About', 'Catalog', 'Contact']
    : ['Home', 'Catalog', 'About', 'Contact'];
  const pages = order.filter(label =>
    (label !== 'About' || appearance.showAbout !== 'no') &&
    (label !== 'Contact' || appearance.showContact !== 'no')
  );
  return <header className="shop-nav"><nav className="container" aria-label="Store navigation">
    <Link className="shop-name" data-position={store.appearance?.logoPosition} to={root}>
      {store.appearance?.brandLogo ? <img className="merchant-logo" alt="" src={store.appearance.brandLogo}/> : <Store size={20}/>}
      <span>{store.name}</span>
    </Link>
    <div className="shop-links">{pages.map(label=>
      <NavLink end key={label} to={label==='Home'?root:root+'/'+label.toLowerCase()}>{label}</NavLink>
    )}<NavLink to={root+"/cart"} aria-label="View cart"><ShoppingBag size={18}/><span key={cart.reduce((n,item)=>n+item.quantity,0)} className="shop-cart-count">{cart.reduce((n,item)=>n+item.quantity,0)}</span></NavLink></div>
  </nav></header>;
}
