import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { getOrders, getOrder, updateOrderStatus } from '../api/ordersApi.js';
import { formatPKR } from '../utils/currency.js';
import LoadingState from '../components/common/LoadingState.jsx';
import './commerce.css';

const statuses = ['pending','confirmed','processing','completed','rejected'];
export default function SellerOrders() {
  const { id } = useParams();
  const [data,setData] = useState(null), [order,setOrder] = useState(null), [status,setStatus] = useState(''), [page,setPage] = useState(1), [sort,setSort] = useState('newest'), [search,setSearch] = useState(''), [error,setError] = useState(''), [action,setAction] = useState(''), [busy,setBusy] = useState(false);
  const load=useCallback(async()=>{
    try { if(id)setOrder(await getOrder(id));else setData(await getOrders({status,page,sort,search}));setError(''); }
    catch(e){setError(e.message);}
  },[id,status,page,sort,search]);
  useEffect(()=>{const timer=setTimeout(load,200);return()=>clearTimeout(timer);},[load]);
  useEffect(()=>{
    const focus=()=>{if(!document.hidden)load();};
    document.addEventListener('visibilitychange',focus);
    const timer=setInterval(focus,45000);
    return()=>{document.removeEventListener('visibilitychange',focus);clearInterval(timer);};
  },[load]);
  async function confirm(){
    setBusy(true);
    try{setOrder(await updateOrderStatus(id,action));setAction('');setError('');window.dispatchEvent(new Event('orders-updated'));}
    catch(e){setError(e.message);setAction('');}
    finally{setBusy(false);}
  }
  return <div className="orders-page"><header className="page-head"><div><p>Seller orders</p><h1>{id?'Order details':'Order requests'}</h1><span>Review customer requests and manage fulfillment.</span></div>{id&&<Link to="/dashboard/orders">All orders</Link>}</header>
    {error&&<p className="alert alert--error" role="alert">{error}</p>}
    {id ? order?<section className="order-admin-details"><p>{order.orderNumber} · {new Date(order.createdAt).toLocaleString()}</p><span className={'order-status '+order.status}>{order.status}</span><h2>Customer</h2><p>{order.customerName} · {order.customerPhone}</p><p>{order.customerCity}</p><p>{order.deliveryAddress}</p><p>{order.customerNotes}</p><h2>Ordered products</h2><div className="order-lines">{order.items.map(item=><div key={item._id || item.product}><strong>{item.productTitle}</strong><p>{item.quantity} × {formatPKR(item.unitPrice)} · {formatPKR(item.lineSubtotal)}</p></div>)}</div><h2>Total · {formatPKR(order.totalAmount)}</h2><p>No payment was collected online.</p><div className="order-actions">{({pending:['confirmed','rejected'],confirmed:['processing'],processing:['completed']})[order.status]?.map(next=><button className="btn" key={next} onClick={()=>setAction(next)}>{({confirmed:'Confirm order',rejected:'Reject order',processing:'Mark Processing',completed:'Mark Completed'})[next]}</button>)}</div></section>:!error&&<LoadingState label="Opening order…"/> :
    <><section className="product-filters"><label className="form-field">Order reference<input placeholder="Search order reference" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/></label><select aria-label="Filter orders by status" value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}}><option value="">All statuses</option>{statuses.map(s=><option key={s}>{s}</option>)}</select><select aria-label="Sort orders" value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></section>
    {data?<><p>{data.total} orders</p>{data.orders.length?<table className="orders-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>{data.orders.map(o=><tr key={o._id}><td>{o.orderNumber}</td><td>{o.customerName}</td><td>{o.items.reduce((sum,item)=>sum+item.quantity,0)}</td><td>{formatPKR(o.totalAmount)}</td><td>{new Date(o.createdAt).toLocaleDateString()}</td><td><span className={'order-status '+o.status}>{o.status}</span></td><td><Link to={'/dashboard/orders/'+o._id}>View details</Link></td></tr>)}</tbody></table>:<section className="state-message"><h2>No order requests here yet</h2><p>New customer requests will appear in this workspace.</p></section>}<div className="order-actions"><button className="btn btn--quiet" disabled={page<=1} onClick={()=>setPage(page-1)}>Previous</button><span>Page {page} of {Math.max(1,data.pages)}</span><button className="btn btn--quiet" disabled={page>=data.pages} onClick={()=>setPage(page+1)}>Next</button></div></>:!error&&<LoadingState label="Loading order requests…"/>}</>}
    <Dialog open={Boolean(action)} onClose={()=>!busy&&setAction('')}><DialogTitle>Update order to {action}?</DialogTitle><DialogContent>{action==='confirmed'?'Inventory is rechecked and deducted when you confirm.':'The customer request will move to this status.'}</DialogContent><DialogActions><Button disabled={busy} onClick={()=>setAction('')}>Cancel</Button><Button disabled={busy} onClick={confirm}>{busy?'Updating…':'Confirm update'}</Button></DialogActions></Dialog>
  </div>;
}
