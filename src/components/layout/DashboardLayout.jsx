import { getOrderStats } from '../../api/ordersApi.js';
import { useCallback, useEffect, useState } from 'react';
import { Drawer, useMediaQuery } from '@mui/material';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ClipboardList, Paintbrush, LayoutDashboard, LogOut, Menu, Package, Plus, Settings, Store, X } from 'lucide-react';
import { getMyStore } from '../../api/storeApi.js';
import { useAuth } from '../../hooks/useAuth.js';
import Logo from '../common/Logo.jsx';
import StateMessage from '../common/StateMessage.jsx';
import './layout.css';

const items = [
  ['/dashboard', 'Overview', LayoutDashboard],
  ['/dashboard/orders', 'Orders', ClipboardList],
  ['/dashboard/products', 'Products', Package],
  ['/dashboard/products/new', 'Add product', Plus],
  ['/dashboard/store/design', 'Customize store', Paintbrush],
  ['/dashboard/store', 'Store settings', Settings],
];

export default function DashboardLayout() {
  const compact = useMediaQuery('(max-width:60rem)');
  const [pending, setPending] = useState(0);
  useEffect(() => {
    let live = true;
    const refresh = () => { if (!document.hidden) getOrderStats().then(stats => { if (live) setPending(stats.pendingOrders); }).catch(() => {}); };
    refresh();
    const timer = setInterval(refresh, 45000);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('orders-updated', refresh);
    return () => { live = false; clearInterval(timer); document.removeEventListener('visibilitychange', refresh); window.removeEventListener('orders-updated', refresh); };
  }, []);
  const [open, setOpen] = useState(false);
  const [store, setStore] = useState(null);
  const [storeLoading, setStoreLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const loadStore = useCallback(() => getMyStore().then(value => {
    setStore(value);
    setError('');
  }).catch(reason => setError(reason.message)).finally(() => setStoreLoading(false)), []);
  useEffect(() => { loadStore(); }, [loadStore, pathname]);
  const section = items.find(([to]) => to === pathname)?.[1] || 'Edit product';
  const navigation = <aside className="merchant-rail">
    <div className="rail-brand"><Logo compact />{compact && <button className="icon-btn" aria-label="Close navigation" onClick={() => setOpen(false)}><X /></button>}</div>
    <small className="rail-caption">Seller workspace</small><nav aria-label="Seller navigation">{items.map(([to, label, Icon]) =>
      <NavLink key={to} end to={to} onClick={() => setOpen(false)}><Icon size={19} />{label}{label === "Orders" && pending > 0 && <span className="shop-cart-count" aria-label={pending+" pending orders"}>{pending}</span>}</NavLink>)}
      {store && <a href={'/s/' + store.slug} target="_blank" rel="noreferrer"><Store size={19} />View store</a>}
    </nav>
    <div className="rail-account"><strong>{user?.fullName}</strong><small>{user?.email}</small><button onClick={() => { logout(); navigate('/'); }}><LogOut size={17}/>Logout</button></div>
  </aside>;
  return <div className="merchant-shell">
    {compact ? <Drawer open={open} onClose={() => setOpen(false)}>{navigation}</Drawer> : navigation}
    <div className="merchant-content">
      <header className="workspace-bar">{compact && <button className="icon-btn" aria-label="Open seller navigation" aria-expanded={open} onClick={() => setOpen(true)}><Menu /></button>}
        <span>{store?.name || 'Seller workspace'}</span><span aria-hidden="true">/</span><strong>{section}</strong>{store && <a className="top-store" href={"/s/"+store.slug}>View store ↗</a>}
      </header>
      <main id="main-content" className="workspace-main">{error ? <StateMessage title="Could not open your store" message={error} action={<button className="btn" onClick={loadStore}>Try again</button>}/> : <Outlet context={{store, storeLoading, refreshStore: loadStore}}/>}</main>
    </div>
  </div>;
}
