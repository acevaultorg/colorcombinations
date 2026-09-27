// Cloudflare Pages Function — POST /api/subscribe
//
// First-party email capture for the <EmailCapture/> component (homepage
// newsletter + Figures Bureau "Get the next study" blocks). Stores signups
// in the SUBSCRIBERS KV namespace on this Pages project. No external account,
// free tier — the lightest self-serve mechanism (FIGURESBUREAU-GENESIS §3
// rule 5; copy-forked from the proven stickyidea waitlist function).
//
// Binding: SUBSCRIBERS (KV) — set on the colorcombinations Pages project.
// Captures interest only. No email is sent by this endpoint.
// Success means the address and explicit consent were persisted.
export async function onRequestPost(context) {
  const { request, env } = context;
  const json = (obj, status = 200) =>
    new Response(JSON.stringify(obj), {
      status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });

  if (request.headers.get("Origin") !== new URL(request.url).origin) {
    return json({ ok: false, error: "Please sign up from this website." }, 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Bad request." }, 400);
  }

  if (body?.consent !== true) {
    return json({ ok: false, error: "Please tick the email consent box." }, 422);
  }

  const email = String((body && body.email) || "").trim().toLowerCase();
  const source = String((body && body.source) || "unknown").slice(0, 80);
  const ref = String((body && body.ref) || "").split(/[?#]/)[0].slice(0, 200);
  if (!["homepage", "bundle-waitlist", "study:color-analysis", "study:wcag-contrast"].includes(source)) {
    return json({ ok: false, error: "Please choose an email list on this website." }, 422);
  }

  // Same permissive-but-real email shape the front-end validates against.
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) {
    return json({ ok: false, error: "That email looks off." }, 422);
  }

  // Never tell a visitor they joined when their address would be discarded.
  if (!env.SUBSCRIBERS) {
    return json({ ok: false, error: "Sign-ups are temporarily unavailable. Please try again later." }, 503);
  }

  try {
    const key = "sub:" + email;
    const stored = await env.SUBSCRIBERS.get(key);
    const existing = stored ? JSON.parse(stored) : null;
    const consent = { at: new Date().toISOString(), version: "email-interest-v1-2026-09-27" };
    if (!existing?.consents?.[source]) {
      await env.SUBSCRIBERS.put(
        key,
        JSON.stringify({
          ...existing,
          email,
          source: existing?.source || source,
          ref,
          ts: existing?.ts || consent.at,
          consents: { ...existing?.consents, [source]: consent },
        })
      );
      // running counter — cheap read for a "N readers subscribed" surface later
      // This legacy approximate counter must not turn a persisted signup into an error.
      if (!existing) {
        try {
          const c = parseInt((await env.SUBSCRIBERS.get("meta:count")) || "0", 10) + 1;
          await env.SUBSCRIBERS.put("meta:count", String(c));
        } catch { /* the subscriber record, not this counter, is authoritative */ }
      }
      return json({ ok: true, status: "subscribed" });
    }
    return json({ ok: true, status: "already_subscribed" });
  } catch {
    return json({ ok: false, error: "Storage error." }, 500);
  }
}

// GET is not a subscribe action.
export async function onRequestGet() {
  return new Response("Method Not Allowed", { status: 405 });
}
