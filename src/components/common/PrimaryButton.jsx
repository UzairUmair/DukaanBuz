import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function PrimaryButton({ to, children, ...props }) {
  const Action = to ? Link : 'button';
  return <Action {...(to ? { to } : { type: 'button' })} {...props} className="btn primary-action">{children}<ArrowRight aria-hidden="true" size={17}/></Action>;
}
