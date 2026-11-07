import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Logo from '../components/common/Logo.jsx';

export function EditionPreview() {
  return <div className="edition"><div className="edition-bar"><b>Mitti Studio</b><span>Tableware</span></div><div className="edition-cover"><img src="/editorial/ceramics.jpg" alt="Glazed ceramic plates and bowls on a wooden shelf" width="840" height="560" fetchPriority="high" /><span className="edition-label">The table collection</span><strong>Handcrafted home essentials.</strong></div><div className="edition-note"><b>Featured collection</b></div><div className="edition-tiles">{["cup","bowl","jug"].map(item => <img key={item} src={"/editorial/"+item+".webp"} alt={"Ceramic "+item} />)}</div></div>;
}
export default function EditionExample() {
  return <main id="main-content" className="edition-page"><Logo/><p className="edition-label">Storefront design example</p><EditionPreview/><p>This editorial example shows how photography, a collection title and a store name work together. Your public catalog uses the products, prices and contact number you add.</p><Link className="btn" to="/register">Create your store <ArrowUpRight size={18}/></Link></main>;
}
