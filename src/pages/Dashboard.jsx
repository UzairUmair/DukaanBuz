import { useEffect, useState } from 'react';
import { Link, Navigate, useOutletContext } from 'react-router-dom';
import { ArrowUpRight, Copy, ExternalLink, Plus } from 'lucide-react';
import { getDashboardStats } from '../api/dashboardApi.js';
import { getProducts } from '../api/productApi.js';
import { useAuth } from '../hooks/useAuth.js';
import ProductImage from '../components/common/ProductImage.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import StateMessage from '../components/common/StateMessage.jsx';
import { formatPKR } from '../utils/currency.js';
import './dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { store, storeLoading } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([getDashboardStats(), getProducts()])
      .then(([nextStats, nextProducts]) => {
        setStats(nextStats);
        setProducts(nextProducts.slice(0, 4));
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading || storeLoading) return <LoadingState label="Preparing your dashboard…" />;
  if (!store) return <Navigate to="/onboarding" replace />;
  if (error) return <StateMessage title="Dashboard unavailable" message={error} action={<button className="btn" type="button" onClick={() => window.location.reload()}>Try again</button>} />;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + '/s/' + store.slug);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Could not copy the store link. Please use View store and copy its address.');
    }
  };

  return <div className="dashboard-page">
    <header className="page-head dashboard-welcome">
      <div><p>{store.name}</p><h1>Welcome back, {user?.fullName?.split(' ')[0]}</h1><span>Your inventory and public catalog at a glance.</span></div>
      <Link className="btn" to="/dashboard/products/new"><Plus size={18} aria-hidden="true" />Add product</Link>
    </header>
    <section className="dashboard-overview" aria-label="Store overview">
      <div className="dashboard-stats">
        <article><strong className="num">{stats.totalProducts}</strong><span>Total products</span></article>
        <article><strong className="num">{stats.activeProducts}</strong><span>Active products</span></article>
        <article><strong className="num">{stats.outOfStockProducts}</strong><span>Out of stock</span></article>
      </div>
      </section><div className="dashboard-columns"><aside className="dashboard-store-link">{products.find(p=>p.imageUrl) && <ProductImage product={products.find(p=>p.imageUrl)} className="sharing-image"/>}<p>Public storefront</p><h2>{store.name}</h2><strong>/s/{store.slug}</strong><span>Share this address with customers.</span><div><button type="button" className="btn btn--quiet" onClick={copyLink}><Copy size={17} aria-hidden="true" />{copied ? 'Copied' : 'Copy link'}</button><a className="btn btn--quiet" href={'/s/' + store.slug} target="_blank" rel="noreferrer"><ExternalLink size={17} aria-hidden="true" />View store</a></div></aside>
    <section className="recent-products"><div className="section-head"><div><h2>Recent products</h2><p>Your newest catalog items.</p></div><Link to="/dashboard/products">Manage products <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      {products.length ? <div className="recent-products__grid">{products.map((product) => <Link key={product.id} to={'/dashboard/products/' + product.id + '/edit'}><ProductImage product={product} /><div><div><h3>{product.title}</h3><small>{product.category} · {product.isActive ? "Published" : "Hidden"}</small></div><strong>{formatPKR(product.price)}</strong><span>{product.stock > 0 ? product.stock + ' in stock' : 'Out of stock'}</span></div></Link>)}</div> : <StateMessage title="No products yet" message="Add the first item to begin your public catalog." action={<Link className="btn" to="/dashboard/products/new">Add your first product</Link>} />}
    </section></div>
  </div>;
}
