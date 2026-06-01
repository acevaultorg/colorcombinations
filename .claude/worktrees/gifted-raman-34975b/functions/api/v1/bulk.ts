/**
 * POST /api/v1/bulk — Cloudflare Pages Function.
 *
 * Paid-tier endpoint: returns the full 378-palette + 30-collection snapshot
 * in one response. Gated by a Gumroad license key passed in the
 * `Authorization: Bearer <key>` header.
 *
 * Flow:
 *   1. Extract bearer token from request header.
 *   2. Call Gumroad's `/v2/licenses/verify` endpoint to confirm the key is
 *      valid + subscription is active. Requires `GUMROAD_API_PRODUCT_ID`
 *      set in Cloudflare Pages env vars (the numeric product ID of the
 *      Commercial API Gumroad product).
 *   3. On success, return the pre-generated bulk JSON that Astro emitted
 *      at build time (`/api/v1/bulk.json` — a static file accessible
 *      unauthenticated, but not publicly linked). Function merely gates
 *      access, doesn't re-generate data.
 *   4. Cache successful verifications in KV (24h) if `LICENSES` KV binding
 *      exists — prevents hammering the Gumroad API on every request.
 *
 * Env-var setup (Cloudflare Pages → Settings → Environment variables):
 *   - GUMROAD_API_PRODUCT_ID: string (e.g. "aBcDeFgHiJ" — from Gumroad URL)
 *   - LICENSES: KV namespace binding (optional, for cache)
 *
 * If env vars are missing, returns 503 with instructions for the operator.
 */

interface Env {
  GUMROAD_API_PRODUCT_ID?: string;
  LICENSES?: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;

  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }

  if (request.method !== "GET" && request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  // Extract the license key.
  const auth = request.headers.get("Authorization") ?? "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return json(
      {
        error: "missing_authorization",
        message:
          "Pass the Gumroad license key as `Authorization: Bearer <key>`. See https://colorcombinations.org/api-docs/#commercial",
      },
      401,
    );
  }
  const licenseKey = match[1].trim();

  // Config check — if operator hasn't set the Gumroad product ID yet,
  // return a clear 503 explaining what's missing.
  if (!env.GUMROAD_API_PRODUCT_ID) {
    return json(
      {
        error: "api_not_configured",
        message:
          "Commercial API is not yet active. Operator needs to set GUMROAD_API_PRODUCT_ID in Cloudflare Pages env vars.",
        docs: "https://colorcombinations.org/api-docs/",
      },
      503,
    );
  }

  // Check KV cache first (24h) if binding exists.
  let cached: string | null = null;
  if (env.LICENSES) {
    try {
      cached = await env.LICENSES.get(`lic:${licenseKey}`);
    } catch {
      cached = null;
    }
  }

  let verified = cached === "ok";

  if (!verified) {
    // Call Gumroad license-verify API.
    try {
      const res = await fetch(
        "https://api.gumroad.com/v2/licenses/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            product_id: env.GUMROAD_API_PRODUCT_ID,
            license_key: licenseKey,
            increment_uses_count: "false",
          }),
        },
      );

      if (!res.ok) {
        return json(
          {
            error: "license_invalid",
            message:
              "The license key was not accepted by Gumroad. Check your subscription status.",
            status: res.status,
          },
          403,
        );
      }

      const body = (await res.json()) as {
        success?: boolean;
        purchase?: { refunded?: boolean; subscription_cancelled_at?: string | null };
      };

      if (!body.success || body.purchase?.refunded || body.purchase?.subscription_cancelled_at) {
        return json(
          {
            error: "license_inactive",
            message: "Subscription is refunded, cancelled, or otherwise inactive.",
          },
          403,
        );
      }

      verified = true;

      // Cache for 24h if KV available.
      if (env.LICENSES) {
        try {
          await env.LICENSES.put(`lic:${licenseKey}`, "ok", {
            expirationTtl: 86400,
          });
        } catch { /* noop */ }
      }
    } catch (err) {
      return json(
        {
          error: "verification_failed",
          message: `Gumroad API unreachable: ${String(err)}`,
        },
        502,
      );
    }
  }

  // Verified — redirect to the pre-generated static bulk file.
  // The static file exists at /api/v1/_bulk.json and is served by the
  // Pages static layer. We proxy-fetch it so the client never sees the
  // underscore-prefixed URL (keeping direct access less obvious).
  const bulkRes = await fetch(new URL("/api/v1/commercial-snapshot.json", request.url).toString());
  if (!bulkRes.ok) {
    return json({ error: "bulk_missing", message: "Bulk snapshot not built yet." }, 500);
  }
  const payload = await bulkRes.text();

  return new Response(payload, {
    status: 200,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "private, max-age=300",
      "X-API-Version": "v1",
      "X-License": "verified",
    },
  });
};

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
  };
}

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
