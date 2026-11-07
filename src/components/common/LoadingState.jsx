import './common.css';
export default function LoadingState({ label = 'Loading…' }) { return <div className="loading-page" role="status" aria-live="polite"><div><span className="spinner" aria-hidden="true" /><p>{label}</p><div className="loading-skeleton" aria-hidden="true"><span /><span /><span /></div></div></div>; }
