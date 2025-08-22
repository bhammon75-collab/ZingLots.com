const h={};function b(){const e=typeof import.meta<"u"?h:void 0,o=e==null?void 0:e.VITE_SUPABASE_FUNCTIONS_BASE;if(o&&o.trim())return o;const t=e==null?void 0:e.VITE_SUPABASE_URL;if(t)try{const a=new URL(t);return/localhost|127\.0\.0\.1/.test(a.hostname)?`${a.origin}/functions/v1`:`https://${a.hostname.split(".")[0]}.functions.supabase.co/functions/v1`}catch{}return"/functions/v1"}const g=b(),f=h==null?void 0:h.VITE_SUPABASE_ANON_KEY;async function y(e,o={}){var n;if(!f)throw new Error("VITE_SUPABASE_ANON_KEY missing");const t=e.startsWith("http")?e:`${g}/${e}`,u={...{apikey:f,Authorization:`Bearer ${f}`},...o.headers||{}},c=await fetch(t,{...o,headers:u,cache:"no-store"});if(!c.ok)throw new Error(`HTTP ${c.status}: ${await c.text()}`);return(n=c.headers.get("content-type"))!=null&&n.includes("json")?await c.json():await c.text()}function m(e){return Number.isFinite(Number(e))?(Number(e)/100).toLocaleString(void 0,{style:"currency",currency:"USD"}):"$0.00"}function $(e,o){const t=o||"";if(!t)return e;try{return new URL(e,t).toString()}catch{return`${t.replace(/\/$/,"")}${e.startsWith("/")?"":"/"}${e}`}}function p(e,o){return`<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${d(e)}</title></head><body style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background:#f7f7f8; padding:24px; color:#0a0a0b;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
      <h1 style="margin:0;font-size:18px;">${d(e)}</h1>
    </div>
    <div style="padding:20px 24px;line-height:1.6;">${o}</div>
    <div style="padding:16px 24px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">This is an automated message from ZingLots.</div>
  </div>
  </body></html>`}function d(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function w(e,o){const t=o.lotTitle||"your lot",a=o.siteUrlBase,u=o.lotId?`/lot/${o.lotId}`:"#",c=o.orderId?"/cart":"#",n=$(u,a),l=$(c,a);switch(e){case"bid_placed":{const r=`Your bid is in for ${t}`,s=`Thanks for bidding on ${t}. View the lot: ${n}`,i=p(r,`
        <p>Thanks for bidding on <strong>${d(t)}</strong>.</p>
        <p><a href="${n}">View the lot</a> to track the action or increase your max bid.</p>
      `);return{subject:r,text:s,html:i}}case"outbid":{const r=`You've been outbid on ${t}`,s=`You've been outbid on ${t}. Rebid now: ${n}`,i=p(r,`
        <p>You've been outbid on <strong>${d(t)}</strong>.</p>
        <p><a href="${n}">Rebid now</a> to take the lead.</p>
      `);return{subject:r,text:s,html:i}}case"reserve_met":{const r=`Reserve met on ${t}`,s=`Reserve has been met on ${t}. See details: ${n}`,i=p(r,`
        <p>The reserve for <strong>${d(t)}</strong> has been met.</p>
        <p><a href="${n}">See details</a> and get your bids in before it ends.</p>
      `);return{subject:r,text:s,html:i}}case"win":{const r=`You won ${t}!`,s=`Congratulations! Pay your invoice to complete the purchase: ${l}`,i=p(r,`
        <p>Congratulations, you won <strong>${d(t)}</strong>!</p>
        <p><a href="${l}">Pay your invoice</a> to complete the purchase.</p>
      `);return{subject:r,text:s,html:i}}case"invoice_created":{const r=`Invoice is ready for ${t}`,s=`Your invoice is ready. Pay now: ${l}`,i=p(r,`
        <p>Your invoice for <strong>${d(t)}</strong> is ready.</p>
        <p><a href="${l}">Pay now</a> to secure your item.</p>
      `);return{subject:r,text:s,html:i}}case"payment_received":{const r=`Payment received for order ${o.orderId||""}`,s=`We've received payment ${m(o.amountCents)}. You can prepare to ship or schedule pickup.`,i=p(r,`
        <p>We've received a payment of <strong>${m(o.amountCents)}</strong>.</p>
        <p>Prepare to ship or schedule pickup with the buyer.</p>
      `);return{subject:r,text:s,html:i}}case"pickup_reminder":{const r=`Pickup reminder: ${t}`,s=`Reminder to pick up ${t} ${o.pickupWindowText?`during ${o.pickupWindowText}`:""}. Details: ${n}`,i=p(r,`
        <p>Reminder to pick up <strong>${d(t)}</strong>${o.pickupWindowText?` during <strong>${d(o.pickupWindowText)}</strong>`:""}.</p>
        <p><a href="${n}">View lot details</a> for location and instructions.</p>
      `);return{subject:r,text:s,html:i}}}}async function x(e){const{to:o,type:t,input:a}=e,u=w(t,a),c={to:o,subject:u.subject,text:u.text,html:u.html},n=await y("email-send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)});if(!n.ok){const l=await n.text().catch(()=>"");throw new Error(`Email provider error (${n.status}): ${l}`)}}export{y as a,x as s};
