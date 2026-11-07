import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import './common.css';

export default function Logo({ to = '/', compact = false }) {
  return <Link className="brand" to={to} aria-label="DukaanSaz home"><span className="brand__seal" aria-hidden="true"><ShoppingBag size={23}/></span><span><b>DukaanSaz</b>{!compact && <small>دکان ساز</small>}</span></Link>;
}
