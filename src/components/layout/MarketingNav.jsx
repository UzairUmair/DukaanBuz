import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../common/Logo.jsx';
import './layout.css';

export default function MarketingNav() {
  const [open, setOpen] = useState(false);
  return <header className="marketing-nav"><div className="container marketing-nav__inner"><Logo /><button className="icon-btn marketing-nav__toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="marketing-menu" aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X /> : <Menu />}</button><nav id="marketing-menu" className={open ? 'marketing-nav__links is-open' : 'marketing-nav__links'} aria-label="Main navigation"><a href="#product">Product</a><Link to="/demo">Demo Store</Link><a href="#features">Features</a><a href="#how">How it works</a><Link to="/login">Login</Link><Link className="btn" to="/register">Create your store</Link></nav></div></header>;
}
