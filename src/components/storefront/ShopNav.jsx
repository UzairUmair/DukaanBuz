import { Link } from 'react-router-dom';
import { Store, MessageCircle } from 'lucide-react';
export default function ShopNav({ store }) {
  const path = '/s/' + store.slug;
  return <header className="shop-nav"><nav className="container" aria-label="Store navigation"><Link className="shop-name" to={path}><Store size={20}/>{store.name}</Link><Link to={path+'#catalog'} onClick={()=>document.getElementById('catalog')?.scrollIntoView()}>Collection</Link><a href={'https://wa.me/'+store.whatsappNumber.replace(/^0/,'92').replace(/\D/g,'')} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Contact</a></nav></header>;
}
