import { defaults } from './themeConfig.js';
export default function ThemeSurface({ store, children }) {
  const a = {...defaults,...store.appearance};
  const foreground = hex => { const rgb = hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4); return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722 > .179 ? "#101c16" : "#ffffff"; };
  const color = value => /^#[0-9a-f]{6}$/i.test(value) ? value : '#063D32';
  return <div className="theme-surface" data-theme={a.themePreset} data-header={a.headerStyle} data-card={a.productCardStyle} data-grid={a.gridDensity} data-hero={a.heroLayout} style={{'--shop-button-text':foreground(color(a.primaryColor)),'--shop-primary':color(a.primaryColor),'--shop-accent':color(a.accentColor),'--shop-bg':color(a.backgroundColor),fontFamily:({inter:'Inter, sans-serif',manrope:'Manrope, sans-serif',jakarta:'"Plus Jakarta Sans", sans-serif'})[a.fontPreset]}}>{children}</div>;
}
