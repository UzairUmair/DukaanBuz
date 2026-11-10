import { Link } from 'react-router-dom';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import ProductImage from '../common/ProductImage.jsx';

export default function SellerInfo({ store, cover, contact }) {
  const digits = (store.whatsappNumber || '').replace(/\D/g,'').replace(/^0/,'92');
  const root = '/s/' + store.slug;
  return <section className="seller-info container">
    <div className="seller-story"><p className="shop-kicker">{store.name}</p>
      <h1>{contact ? 'Contact the store' : 'About '+store.name}</h1>
      {contact ? <><p>Ask the seller about a product, its availability, or an item you saw in the catalog.</p>
        {digits && !store.isDemo ? <a className="cover-browse" href={'https://wa.me/'+digits} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Chat on WhatsApp</a> : <p>Direct inquiries are unavailable for this store.</p>}</> :
        <><p>{store.description || store.appearance?.heroSubtitle || 'Discover the current collection from '+store.name+'.'}</p><Link className="cover-browse" to={root+'/catalog'}>Browse catalog <ArrowUpRight size={17}/></Link></>}
      {store.city && <dl><dt>Location</dt><dd>{store.city}</dd></dl>}
    </div>
    {cover && <figure className="seller-feature"><ProductImage product={cover} priority/><figcaption><Link to={root+'/p/'+cover.id}>{cover.title} ↗</Link></figcaption></figure>}
  </section>;
}
