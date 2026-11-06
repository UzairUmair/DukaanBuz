import { AlertCircle } from 'lucide-react';
import './common.css';
export default function StateMessage({ title, message, action }) { return <div className="state-message"><AlertCircle aria-hidden="true" size={28} /><h2>{title}</h2><p>{message}</p>{action}</div>; }
