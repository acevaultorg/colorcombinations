import assert from 'node:assert/strict';
import { onRequestPost } from '../functions/api/subscribe.js';

const data = new Map();
const env = { SUBSCRIBERS: { get: async k => data.get(k), put: async (k,v) => data.set(k,v) } };
const payload = { email: 'Example@EXAMPLE.invalid', source: 'homepage', ref: '/?email=private', consent: true };
async function send(body = payload, bindings = env, origin = 'https://colorcombinations.org') {
  const response = await onRequestPost({ request: new Request('https://colorcombinations.org/api/subscribe', {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  }), env: bindings });
  return { status: response.status, body: await response.json() };
}
assert.equal((await send({...payload, consent: false})).status, 422);
assert.equal((await send({...payload, consent: 'true'})).status, 422);
assert.equal((await send(payload, env, 'https://unrelated.example')).status, 403);
assert.equal((await send({...payload, source: 'unexpected'})).status, 422);
assert.equal(data.size, 0);
const unavailable = await send(payload, {});
assert.equal(unavailable.status, 503); assert.equal(unavailable.body.ok, false);
assert.equal((await send()).body.status, 'subscribed');
let saved = JSON.parse(data.get('sub:example@example.invalid'));
assert.equal(saved.email, 'example@example.invalid');
assert.equal(saved.ref, '/'); assert.ok(saved.consents.homepage.at);
assert.equal(saved.consents.homepage.version, 'email-interest-v1-2026-09-27');
assert.equal(saved.ua, undefined);
assert.equal((await send()).body.status, 'already_subscribed');
assert.equal(data.get('meta:count'), '1');
assert.equal((await send({...payload, source: 'bundle-waitlist'})).body.status, 'subscribed');
saved = JSON.parse(data.get('sub:example@example.invalid'));
assert.deepEqual(Object.keys(saved.consents).sort(), ['bundle-waitlist','homepage']);
assert.equal(data.get('meta:count'), '1');
const failed = await send(payload, { SUBSCRIBERS: { get: async()=>null, put:async()=>{throw Error('offline')} } });
assert.equal(failed.status, 500); assert.equal(failed.body.ok, false);
data.set('sub:legacy@example.invalid', JSON.stringify({email:'legacy@example.invalid',source:'bundle-waitlist',ts:'2026-09-01'}));
await send({...payload,email:'legacy@example.invalid'});
saved = JSON.parse(data.get('sub:legacy@example.invalid'));
assert.equal(saved.ts, '2026-09-01'); assert.equal(saved.source, 'bundle-waitlist');
assert.deepEqual(Object.keys(saved.consents), ['homepage']);
console.log('PASS: consent/origin/source validation; storage failure; durable consent; repeat and separate-list consent; legacy preservation. No network or email.');
