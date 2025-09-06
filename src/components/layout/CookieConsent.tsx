import { useEffect, useState } from 'react';

export default function CookieConsent(){
  const [visible, setVisible] = useState(false);
  useEffect(()=>{
    const v = localStorage.getItem('analytics_consent');
    setVisible(v !== 'true' && v !== 'false');
    const root = document.documentElement;
    const cls = 'has-cookie-banner';
    if (v !== 'true' && v !== 'false') root.classList.add(cls);
    return () => { root.classList.remove(cls); };
  },[]);
  if (!visible) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-zinc-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-sm opacity-90">We use analytics cookies to improve your experience. Accept or Decline analytics.</p>
        <div className="ml-auto flex gap-2">
          <button className="rounded bg-green-600 px-3 py-1 text-sm" onClick={()=>{ localStorage.setItem('analytics_consent','true'); setVisible(false); document.documentElement.classList.remove('has-cookie-banner'); }}>Accept</button>
          <button className="rounded bg-zinc-700 px-3 py-1 text-sm" onClick={()=>{ localStorage.setItem('analytics_consent','false'); setVisible(false); document.documentElement.classList.remove('has-cookie-banner'); }}>Decline</button>
        </div>
      </div>
    </div>
  );
}

