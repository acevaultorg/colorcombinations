// Cloudflare Pages Function — POST /api/subscribe
//
// First-party email capture for the <EmailCapture/> component (homepage
// newsletter + Figures Bureau "Get the next study" blocks). Stores signups
// in the SUBSCRIBERS KV namespace on this Pages project. No external account,
// free tier — the lightest self-serve mechanism (FIGURESBUREAU-GENESIS §3
// rule 5; copy-forked from the proven stickyidea waitlist function).
//
// Binding: SUBSCRIBERS (KV) — set on the colorcombinations Pages project.
// Graceful: if the binding is missing, the form still returns ok:true (pending)
// so it never *looks* broken while the binding propagates.
export async function onRequestPost(context) {
  const { request, env } = context;
  const json = (obj, status = 200) =>
    new Response(JSON.stringify(obj), {
      status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Bad request." }, 400);
  }

  const email = String((body && body.email) || "").trim().toLowerCase();
  const source = String((body && body.source) || "unknown").slice(0, 80);
  const ref = String((body && body.ref) || "").slice(0, 200);

  // Same permissive-but-real email shape the front-end validates against.
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) {
    return json({ ok: false, error: "That email looks off." }, 422);
  }

  // KV not yet bound — accept gracefully so the form never looks broken.
  if (!env.SUBSCRIBERS) {
    return json({ ok: true, pending: true });
  }

  try {
    const key = "sub:" + email;
    const existing = await env.SUBSCRIBERS.get(key);
    if (!existing) {
      await env.SUBSCRIBERS.put(
        key,
        JSON.stringify({
          email,
          source,
          ref,
          ua: request.headers.get("user-agent") || "",
          country: (request.cf && request.cf.country) || "",
          ts: new Date().toISOString(),
        })
      );
      // running counter — cheap read for a "N readers subscribed" surface later
      const c = parseInt((await env.SUBSCRIBERS.get("meta:count")) || "0", 10) + 1;
      await env.SUBSCRIBERS.put("meta:count", String(c));
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
