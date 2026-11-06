import './common.css';
export default function LoadingState({ label = 'Loading…' }) { return <div className="loading-page" role="status"><div><span className="spinner" aria-hidden="true" /><p>{label}</p></div></div>; }
