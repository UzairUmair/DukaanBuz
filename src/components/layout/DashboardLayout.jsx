import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, Package, Plus, Settings, Store, X } from 'lucide-react';
import { getMyStore } from '../../api/storeApi.js';
import { useAuth } from '../../hooks/useAuth.js';
import Logo from '../common/Logo.jsx';
import './layout.css';

const items = [
  ['/dashboard', 'Overview', LayoutDashboard, true], ['/dashboard/products', 'Products', Package], ['/dashboard/products/new', 'Add product', Plus], ['/dashboard/store', 'Store settings', Settings],
];
export default function DashboardLayout() {
  const [open, setOpen] = useState(false); const [store, setStore] = useState(null); const [storeLoading, setStoreLoading] = useState(true); const { user, logout } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const loadStore = () => getMyStore().then(setStore).catch(() => setStore(null)).finally(() => setStoreLoading(false));
  useEffect(() => { loadStore(); }, [location.pathname]);
  const signOut = () => { logout(); navigate('/'); };
  return <div className="dashboard-shell"><button className="icon-btn dashboard-mobile-toggle" type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Close dashboard navigation' : 'Open dashboard navigation'}>{open ? <X /> : <Menu />}</button><aside className={open ? 'dashboard-sidebar is-open' : 'dashboard-sidebar'}><Logo compact /><nav aria-label="Seller navigation">{items.map(([to, label, Icon, end]) => <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}><Icon aria-hidden="true" size={20} />{label}</NavLink>)}{store && <a href={`/s/${store.slug}`} target="_blank" rel="noreferrer"><Store aria-hidden="true" size={20} />View store</a>}</nav><div className="dashboard-sidebar__account"><p>{user?.fullName}</p><small>{user?.email}</small><button className="sidebar-logout" type="button" onClick={signOut}><LogOut aria-hidden="true" size={18} />Logout</button></div></aside><main id="main-content" className="dashboard-main"><Outlet context={{ store, storeLoading, refreshStore: loadStore }} /></main></div>;
}
