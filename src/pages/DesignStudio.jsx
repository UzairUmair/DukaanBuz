import { useEffect, useState } from 'react';
import { getMyStore } from '../api/storeApi.js';
import { getProducts } from '../api/productApi.js';
import api, { unwrap } from '../api/client.js';
import LogoEditor from '../components/storefront/LogoEditor.jsx';
import PublicStore from './PublicStore.jsx';
import { defaults, presets } from '../components/storefront/themeConfig.js';
import LoadingState from '../components/common/LoadingState.jsx';
import './studio.css';

export default function DesignStudio() {
  const [store,setStore]=useState(null),[products,setProducts]=useState([]),[draft,setDraft]=useState(defaults),[saved,setSaved]=useState(defaults),[device,setDevice]=useState('desktop'),[previewPage,setPreviewPage]=useState('home'),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
  const dirty=JSON.stringify(draft)!==JSON.stringify(saved);
  useEffect(()=>{Promise.all([getMyStore(),getProducts()]).then(([s,p])=>{setStore(s);setProducts(p);setDraft({...defaults,...s.appearance});setSaved({...defaults,...s.appearance});}).catch(e=>setMessage(e.message));},[]);
  useEffect(()=>{const warn=e=>{if(dirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
  const update=(key,value)=>{
    setDraft(current=>({...current,[key]:value}));
    if ((key === 'showAbout' && value === 'no' && previewPage === 'about') || (key === 'showContact' && value === 'no' && previewPage === 'contact')) setPreviewPage('home');
  };
  async function publish(){setBusy(true);try{const s=unwrap(await api.put('/stores/me/appearance',draft));setStore(s);setSaved({...defaults,...s.appearance});setDraft({...defaults,...s.appearance});setMessage('Design published.');}catch(e){setMessage(e.message);}finally{setBusy(false);}}
  if(!store)return <><p role="alert">{message}</p><LoadingState label="Opening design studio…"/></>;
  return <div className="design-studio"><header className="studio-head"><div><h1>Store Design Studio</h1><p>{dirty?'Unsaved changes':'Published design'} · {store.name}</p></div><button className="btn" disabled={busy||!dirty} onClick={publish}>{busy?'Publishing…':'Save & Publish'}</button></header>{message&&<p role="status" className="alert">{message}</p>}<div className="studio-grid"><aside className="studio-controls"><LogoEditor draft={draft} update={update}/><details className="studio-group" open><summary>Theme and palette</summary><div className="studio-section-title"><h2>Store appearance</h2><p>Select a preset to preview it on your store.</p></div>{Object.keys(presets).map(key=><button className={'theme-choice '+(draft.themePreset===key?'selected':'')} key={key} onClick={()=>setDraft({...draft,...presets[key],themePreset:key,...(key==='editorial'?{headerStyle:'editorial',productCardStyle:'editorial',gridDensity:'comfortable',heroLayout:'banner'}:{})})}>{({heritage:'Heritage Green',editorial:'Editorial Cream',modern:'Modern Contrast'})[key]}<span style={{background:presets[key].primaryColor}}/></button>)}
    {['primaryColor','accentColor','backgroundColor'].map(key=><label key={key}>{key.replace('Color',' color')}<input type="color" value={draft[key]} onChange={e=>update(key,e.target.value)}/></label>)}
    </details><details className="studio-group"><summary>Typography and layout</summary>{Object.entries({fontPreset:['inter','manrope','jakarta'],headerStyle:['minimal','centered','editorial'],productCardStyle:['minimal','soft','editorial'],gridDensity:['compact','comfortable','spacious'],heroLayout:['split','banner','minimal']}).map(([key,options])=><label key={key}>{key.replace(/([A-Z])/g,' $1')}<select value={draft[key]} onChange={e=>update(key,e.target.value)}>{options.map(option=><option key={option}>{option}</option>)}</select></label>)}
    </details><details className="studio-group" open><summary>Pages and navigation</summary>
    <p className="studio-tip">Home and Catalog are always available. Hiding a page removes its navigation links.</p>
    <label>Navigation order<select value={draft.navigationOrder} onChange={e=>update('navigationOrder',e.target.value)}><option value="standard">Home · Catalog · About · Contact</option><option value="story-first">Home · About · Catalog · Contact</option></select></label>
    <label>About page<select value={draft.showAbout} onChange={e=>update('showAbout',e.target.value)}><option value="yes">Show in navigation</option><option value="no">Hide from navigation</option></select></label>
    <label>Contact page<select value={draft.showContact} onChange={e=>update('showContact',e.target.value)}><option value="yes">Show in navigation</option><option value="no">Hide from navigation</option></select></label>
    </details><details className="studio-group"><summary>Cover and introduction</summary>
    <label>Cover text position<select value={draft.coverPosition} onChange={e=>update('coverPosition',e.target.value)}><option value="left">Left of photographs</option><option value="right">Right of photographs</option></select></label>
    <label>Products featured on Home<select value={draft.homeProducts} onChange={e=>update('homeProducts',e.target.value)}><option value="3">3 products</option><option value="6">6 products</option><option value="9">9 products</option><option value="0">Hide featured products</option></select></label><label>Hero title<input maxLength={120} value={draft.heroTitle} onChange={e=>update('heroTitle',e.target.value)}/></label><label>Hero subtitle<textarea maxLength={500} value={draft.heroSubtitle} onChange={e=>update('heroSubtitle',e.target.value)}/></label><p className="studio-tip">Hero imagery uses your uploaded products. </p></details><button className="btn btn--quiet" onClick={()=>setDraft(saved)}>Reset unsaved changes</button><button className="btn btn--quiet" onClick={()=>setDraft(defaults)}>Restore default theme</button></aside><section className="studio-stage"><div className="studio-preview-title"><strong>Live storefront</strong><span>Changes appear here as you edit</span></div><div className="preview-devices" aria-label="Preview device">{['desktop','tablet','mobile'].map(size=><button key={size} aria-pressed={device===size} onClick={()=>setDevice(size)}>{size}</button>)}</div><div className="preview-pages" aria-label="Preview page">{['home','catalog','about','contact'].filter(name => (name !== 'about' || draft.showAbout !== 'no') && (name !== 'contact' || draft.showContact !== 'no')).map(name=><button key={name} type="button" aria-pressed={previewPage===name} onClick={()=>setPreviewPage(name)}>{name}</button>)}</div><div className={'studio-preview '+device} onClickCapture={event=>{
      const link=event.target.closest('a');
      if (!link) return;
      const href=link.getAttribute('href') || '';
      const root='/s/'+store.slug;
      if (href === root || href === root+'/catalog' || href === root+'/about' || href === root+'/contact') {
        event.preventDefault();
        setPreviewPage(href === root ? 'home' : href.slice(root.length+1));
      } else if (href.startsWith(root+'/p/') || href.startsWith('https://wa.me/')) {
        event.preventDefault();
      }
    }}><PublicStore page={previewPage} previewStore={{...store,appearance:draft}} previewProducts={products}/></div></section></div></div>;
}
