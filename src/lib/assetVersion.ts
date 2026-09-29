// Content-hash query for files served from public/ (card mulhjolixy9ov2, 2026-09-29).
// Cloudflare serves /amazon-track.js with max-age=14400, so after a deploy a returning
// browser can run a 4-hour-old tracker against new HTML. A ?v=<hash> that changes only
// when the file changes makes every deploy of the file take effect at once.
// Read from process.cwd(): the build (local and CI) runs from the repo root.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const cache = new Map<string, string>();

export function assetVersion(publicPath: string): string {
  let v = cache.get(publicPath);
  if (!v) {
    const buf = readFileSync(join(process.cwd(), "public", publicPath.replace(/^\//, "")));
    v = createHash("sha256").update(buf).digest("hex").slice(0, 10);
    cache.set(publicPath, v);
  }
  return `${publicPath}?v=${v}`;
}
