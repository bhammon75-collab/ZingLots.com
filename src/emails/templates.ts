export type EmailEventType =
  | 'bid_placed'
  | 'outbid'
  | 'reserve_met'
  | 'win'
  | 'invoice_created'
  | 'payment_received'
  | 'pickup_reminder';

export type EmailRenderInput = {
  lotId?: string;
  lotTitle?: string;
  orderId?: string;
  sellerName?: string;
  buyerName?: string;
  amountCents?: number;
  pickupWindowText?: string;
  siteUrlBase?: string; // optional override
};

export type RenderedEmail = {
  subject: string;
  text: string;
  html: string;
};

function usd(cents?: number | null): string {
  if (!Number.isFinite(Number(cents))) return '$0.00';
  return (Number(cents) / 100).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

function link(path: string, base?: string) {
  const b = base || '';
  if (!b) return path;
  try {
    const u = new URL(path, b);
    return u.toString();
  } catch {
    return `${b.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
  }
}

function wrapHtml(title: string, body: string): string {
  return `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${escapeHtml(
    title
  )}</title></head><body style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background:#f7f7f8; padding:24px; color:#0a0a0b;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
      <h1 style="margin:0;font-size:18px;">${escapeHtml(title)}</h1>
    </div>
    <div style="padding:20px 24px;line-height:1.6;">${body}</div>
    <div style="padding:16px 24px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">This is an automated message from ZingLots.</div>
  </div>
  </body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderEmail(type: EmailEventType, input: EmailRenderInput): RenderedEmail {
  const lotTitle = input.lotTitle || 'your lot';
  const base = input.siteUrlBase;
  const lotPath = input.lotId ? `/lot/${input.lotId}` : '#';
  const orderPath = input.orderId ? `/cart` : '#';
  const lotHref = link(lotPath, base);
  const orderHref = link(orderPath, base);

  switch (type) {
    case 'bid_placed': {
      const subject = `Your bid is in for ${lotTitle}`;
      const text = `Thanks for bidding on ${lotTitle}. View the lot: ${lotHref}`;
      const html = wrapHtml(subject, `
        <p>Thanks for bidding on <strong>${escapeHtml(lotTitle)}</strong>.</p>
        <p><a href="${lotHref}">View the lot</a> to track the action or increase your max bid.</p>
      `);
      return { subject, text, html };
    }
    case 'outbid': {
      const subject = `You've been outbid on ${lotTitle}`;
      const text = `You've been outbid on ${lotTitle}. Rebid now: ${lotHref}`;
      const html = wrapHtml(subject, `
        <p>You've been outbid on <strong>${escapeHtml(lotTitle)}</strong>.</p>
        <p><a href="${lotHref}">Rebid now</a> to take the lead.</p>
      `);
      return { subject, text, html };
    }
    case 'reserve_met': {
      const subject = `Reserve met on ${lotTitle}`;
      const text = `Reserve has been met on ${lotTitle}. See details: ${lotHref}`;
      const html = wrapHtml(subject, `
        <p>The reserve for <strong>${escapeHtml(lotTitle)}</strong> has been met.</p>
        <p><a href="${lotHref}">See details</a> and get your bids in before it ends.</p>
      `);
      return { subject, text, html };
    }
    case 'win': {
      const subject = `You won ${lotTitle}!`;
      const text = `Congratulations! Pay your invoice to complete the purchase: ${orderHref}`;
      const html = wrapHtml(subject, `
        <p>Congratulations, you won <strong>${escapeHtml(lotTitle)}</strong>!</p>
        <p><a href="${orderHref}">Pay your invoice</a> to complete the purchase.</p>
      `);
      return { subject, text, html };
    }
    case 'invoice_created': {
      const subject = `Invoice is ready for ${lotTitle}`;
      const text = `Your invoice is ready. Pay now: ${orderHref}`;
      const html = wrapHtml(subject, `
        <p>Your invoice for <strong>${escapeHtml(lotTitle)}</strong> is ready.</p>
        <p><a href="${orderHref}">Pay now</a> to secure your item.</p>
      `);
      return { subject, text, html };
    }
    case 'payment_received': {
      const subject = `Payment received for order ${input.orderId || ''}`;
      const text = `We've received payment ${usd(input.amountCents)}. You can prepare to ship or schedule pickup.`;
      const html = wrapHtml(subject, `
        <p>We've received a payment of <strong>${usd(input.amountCents)}</strong>.</p>
        <p>Prepare to ship or schedule pickup with the buyer.</p>
      `);
      return { subject, text, html };
    }
    case 'pickup_reminder': {
      const subject = `Pickup reminder: ${lotTitle}`;
      const text = `Reminder to pick up ${lotTitle} ${input.pickupWindowText ? `during ${input.pickupWindowText}` : ''}. Details: ${lotHref}`;
      const html = wrapHtml(subject, `
        <p>Reminder to pick up <strong>${escapeHtml(lotTitle)}</strong>${input.pickupWindowText ? ` during <strong>${escapeHtml(input.pickupWindowText)}</strong>` : ''}.</p>
        <p><a href="${lotHref}">View lot details</a> for location and instructions.</p>
      `);
      return { subject, text, html };
    }
  }
}

