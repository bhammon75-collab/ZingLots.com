import { supaFetch } from '@/lib/supaFetchVite';
import { renderEmail, EmailEventType, EmailRenderInput } from '@/emails/templates';

export type NotifyParams = {
  to: string | string[];
  type: EmailEventType;
  input: EmailRenderInput;
};

export async function sendEmail(params: NotifyParams): Promise<void> {
  const { to, type, input } = params;
  const rendered = renderEmail(type, input);
  const body = {
    to,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
  };
  const res = await supaFetch('email-send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Email provider error (${res.status}): ${errText}`);
  }
}

