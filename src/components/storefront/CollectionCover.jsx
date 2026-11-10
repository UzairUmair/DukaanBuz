import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import ProductImage from '../common/ProductImage.jsx';
import './collection-cover.css';

export default function CollectionCover({ store, featured, products }) {
  const companion = products.find(item => item.imageUrl && item.id !== featured?.id && item.category !== featured?.category);
  const photographs = [featured, companion].filter(Boolean);

  return <section className="collection-cover" data-position={store.appearance?.coverPosition || "left"} aria-label="Store introduction">
    <div className="cover-spread">
      <div className="cover-story">
        {store.city && <p className="cover-location"><MapPin size={15}/>{store.city}</p>}
        <h1>{store.appearance?.heroTitle || store.name}</h1>
        <p className="cover-description">{store.appearance?.heroSubtitle || store.description}</p>
        <Link className="cover-browse" to={"/s/"+store.slug+"/catalog"}>Explore the collection <ArrowDown size={16}/></Link>
      </div>
      {photographs.length > 0 && <div className="cover-gallery">
        {photographs.map(item => <Link key={item.id} to={'/s/'+store.slug+'/p/'+item.id} className="cover-piece">
          <ProductImage product={item} priority/>
          <span>{item.title.replace(/^TEST · /,'')} <ArrowUpRight aria-hidden="true" size={16}/></span>
        </Link>)}
      </div>}
    </div>
  </section>;
}
