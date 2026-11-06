import { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { getMyStore, updateStore } from '../api/storeApi.js';
import LoadingState from '../components/common/LoadingState.jsx';
import StateMessage from '../components/common/StateMessage.jsx';
import './dashboard.css';

export default function StoreSettings() {
  const [form, setForm] = useState(null); const [error, setError] = useState(''); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false); const [copied, setCopied] = useState(false);
  useEffect(() => { getMyStore().then(setForm).catch((requestError) => setError(requestError.message)); }, []);
  if (!form && !error) return <LoadingState label="Loading store settings…" />;
  if (!form && error) return <StateMessage title="Store settings unavailable" message={error} action={<button className="btn" type="button" onClick={() => window.location.reload()}>Try again</button>} />;
  const update = (event) => { setForm({ ...form, [event.target.name]: event.target.value }); setSaved(false); };
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(''); try { const updated = await updateStore({ name: form.name, description: form.description, whatsappNumber: form.whatsappNumber, city: form.city }); setForm(updated); setSaved(true); } catch (requestError) { setError(requestError.message); } finally { setSaving(false); } };
  const publicUrl = `${window.location.origin}/s/${form?.slug}`;
  return <div className="settings-page"><header className="page-head"><div><p>Store settings</p><h1>Keep your public details current.</h1><span>These values appear in your storefront and WhatsApp contact action.</span></div></header>{error && <p className="alert alert--error">{error}</p>}<div className="settings-grid"><form className="settings-form" onSubmit={submit}><div className="form-field"><label htmlFor="storeName">Store name</label><input id="storeName" name="name" value={form?.name || ''} onChange={update} required /></div><div className="form-field"><label htmlFor="storeDescription">Description</label><textarea id="storeDescription" name="description" value={form?.description || ''} onChange={update} maxLength="500" /></div><div className="settings-pair"><div className="form-field"><label htmlFor="storeWhatsapp">WhatsApp number</label><input id="storeWhatsapp" name="whatsappNumber" value={form?.whatsappNumber || ''} onChange={update} required inputMode="tel" /></div><div className="form-field"><label htmlFor="storeCity">City</label><input id="storeCity" name="city" value={form?.city || ''} onChange={update} /></div></div><button className="btn" type="submit" disabled={saving}>{saving ? 'Saving…' : saved ? <><Check size={18} />Saved</> : 'Save store settings'}</button></form><aside className="store-link-panel"><p>Your public store</p><strong>/s/{form?.slug}</strong><span>This slug stays fixed when you edit the store name.</span><div><button className="btn btn--quiet" type="button" onClick={async () => { await navigator.clipboard.writeText(publicUrl); setCopied(true); setTimeout(() => setCopied(false), 1800); }}><Copy size={18} />{copied ? 'Copied' : 'Copy link'}</button><a className="btn" href={`/s/${form?.slug}`} target="_blank" rel="noreferrer">View store <ExternalLink size={18} /></a></div></aside></div></div>;
}
