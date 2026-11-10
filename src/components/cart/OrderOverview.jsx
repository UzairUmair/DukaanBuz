import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrderStats, getOrders } from '../../api/ordersApi.js';

export default function OrderOverview() {
  const [stats,setStats]=useState(null),[recent,setRecent]=useState([]),[error,setError]=useState('');
  useEffect(()=>{
    let live=true;
    async function load(){
      if(document.hidden)return;
      try{const [s,list]=await Promise.all([getOrderStats(),getOrders({status:'pending'})]);if(live){setStats(s);setRecent(list.orders.slice(0,3));setError('');}}
      catch(e){if(live)setError(e.message);}
    }
    load();const timer=setInterval(load,45000);document.addEventListener('visibilitychange',load);
    return()=>{live=false;clearInterval(timer);document.removeEventListener('visibilitychange',load);};
  },[]);
  return <section className="order-overview"><div className="section-head"><h2>New Order Requests</h2><Link to="/dashboard/orders">View All Orders ↗</Link></div>{error?<p role="alert">{error}</p>:stats?<><div className="order-stats"><article><span>Total orders</span><strong>{stats.totalOrders}</strong></article><article><span>Pending review</span><strong>{stats.pendingOrders}</strong></article></div>{recent.map(order=><p key={order._id}><Link to={'/dashboard/orders/'+order._id}>{order.orderNumber}</Link> · {order.customerName}</p>)}{!recent.length&&<p>New requests will appear here.</p>}</>:<p>Loading order requests…</p>}</section>;
}
