import { Outlet } from 'react-router-dom';
import Logo from '../common/Logo.jsx';
import './layout.css';
export default function StorefrontLayout() { return <div className="storefront-shell"><header className="storefront-top"><div className="container"><Logo compact /><span>Catalog powered by DukaanSaz</span></div></header><main id="main-content"><Outlet /></main></div>; }
