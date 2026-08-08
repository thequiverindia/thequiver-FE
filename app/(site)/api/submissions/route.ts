import { getPayload } from 'payload';
import config from '@payload-config';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const KINDS = ['contact', 'claim', 'advertising'] as const;
type Kind = (typeof KINDS)[number];

/**
 * Receives reader form submissions (contact / fact-check claim / advertising)
 * and stores them for the newsroom. No email is sent — v1 policy — so the
 * admin panel's Submissions inbox is the delivery mechanism.
 */
export async function POST(req: Request) {
  if (!rateLimit(`submission:${clientIp(req)}`, 5, 60_000)) {
    return Response.json({ error: 'Too many messages — try again shortly.' }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as
    | {
        kind?: string;
        name?: string;
        email?: string;
        subject?: string;
        message?: string;
        sourceUrl?: string;
        website?: string;
      }
    | null;

  // Honeypot: real people never fill this.
  if (!body || body.website) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const kind = (KINDS as readonly string[]).includes(body.kind ?? '')
    ? (body.kind as Kind)
    : 'contact';
  const message = (body.message ?? '').trim();
  if (message.length < 5 || message.length > 5000) {
    return Response.json(
      { error: 'Please write between 5 and 5000 characters.' },
      { status: 400 },
    );
  }
  const email = (body.email ?? '').trim().toLowerCase();
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: 'submissions',
      data: {
        kind,
        status: 'new',
        name: (body.name ?? '').trim().slice(0, 120) || undefined,
        email: email || undefined,
        subject: (body.subject ?? '').trim().slice(0, 200) || undefined,
        message,
        sourceUrl: (body.sourceUrl ?? '').trim().slice(0, 500) || undefined,
      },
      context: { disableRevalidate: true },
    });
    return Response.json({ ok: true });
  } catch (e) {
    console.error('[submissions] failed', e);
    return Response.json({ error: 'Could not send your message.' }, { status: 500 });
  }
}
