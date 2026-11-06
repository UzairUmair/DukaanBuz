import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createProduct, getProduct, updateProduct, uploadProductImage } from '../api/productApi.js';
import ProductForm from '../components/products/ProductForm.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import StateMessage from '../components/common/StateMessage.jsx';
import './dashboard.css';

export default function ProductEditor({ mode }) {
  const editing = mode === 'edit'; const { id } = useParams(); const navigate = useNavigate(); const [product, setProduct] = useState(null); const [loading, setLoading] = useState(editing); const [submitting, setSubmitting] = useState(false); const [error, setError] = useState(''); const [partial, setPartial] = useState(false); const [createdId, setCreatedId] = useState(null);
  useEffect(() => { if (editing) getProduct(id).then(setProduct).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false)); }, [editing, id]);
  const save = async (values, image) => { setSubmitting(true); setError(''); setPartial(false); try { let saved; let targetId = id || createdId; if (targetId) saved = await updateProduct(targetId, values); else { saved = await createProduct(values); targetId = saved.id; setCreatedId(targetId); } if (image) { try { saved = await uploadProductImage(targetId, image); } catch (uploadError) { setProduct(saved); setPartial(true); setError(uploadError.message); return; } } navigate('/dashboard/products', { replace: true }); } catch (requestError) { setError(requestError.message); } finally { setSubmitting(false); } };
  if (loading) return <LoadingState label="Loading product details…" />;
  if (editing && !product) return <StateMessage title="Product unavailable" message={error || 'This product could not be found in your store.'} action={<Link className="btn" to="/dashboard/products">Back to products</Link>} />;
  return <div className="editor-page"><Link className="back-link" to="/dashboard/products"><ArrowLeft size={18} />Back to products</Link><header className="page-head"><div><p>{editing ? 'Edit product' : 'New product'}</p><h1>{editing ? product?.title || 'Product details' : 'Add to your catalog'}</h1><span>Product information is saved first, then the selected image is uploaded.</span></div></header>{error && <p className="alert alert--error" role="alert">{error}</p>}<ProductForm initial={product} onSubmit={save} submitLabel={editing || createdId ? 'Save changes' : 'Create product'} submitting={submitting} partialSuccess={partial} /></div>;
}
