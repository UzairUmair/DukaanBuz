import { useState } from 'react';

export default function LogoEditor({ draft, update }) {
  const [error, setError] = useState('');
  async function select(file) {
    if (!file) return;
    setError('');
    try {
      if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 5*1024*1024) throw new Error('Choose a PNG, JPEG or WebP under 5 MB.');
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 320 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width*scale));
      canvas.height = Math.max(1, Math.round(bitmap.height*scale));
      canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const logo = canvas.toDataURL('image/webp', .82);
      if (!logo.startsWith('data:image/webp;base64,') || logo.length > 90000) throw new Error('Choose a smaller logo.');
      update('brandLogo',logo);
    } catch (reason) { setError(reason.message || 'Unable to read this image.'); }
  }
  return <details className="studio-group logo-editor" open><summary>Business logo</summary>
    {draft.brandLogo && <img alt="Selected business logo" src={draft.brandLogo}/>}
    <label>{draft.brandLogo ? 'Replace logo' : 'Upload logo'}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event=>{select(event.target.files[0]);event.target.value='';}}/></label>
    <label>Logo position<select value={draft.logoPosition || 'beside'} onChange={event=>update('logoPosition',event.target.value)}><option value="beside">Beside business name</option><option value="above">Above business name</option></select></label>
    {draft.brandLogo && <button type="button" className="btn btn--quiet" onClick={()=>update('brandLogo','')}>Remove logo</button>}
    {error && <p role="alert">{error}</p>}
  </details>;
}
