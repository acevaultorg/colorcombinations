import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../public/amazon-track.js', import.meta.url), 'utf8');
function runTracker(trackerSource, href, trusted = true, agent = false, pathname = '/tools/') {
  const listeners = {}, beacons = [], events = [];
  const a = Object.assign(new URL(href, 'https://colorcombinations.org'), {dataset:{tool:'Color guide'}});
  const document = {cookie:'',addEventListener:(name,fn)=>listeners[name]=fn};
  vm.runInNewContext(trackerSource, {URL, document, location:new URL(`https://colorcombinations.org${pathname}`),
    navigator:{sendBeacon:url=>beacons.push(new URL(url))}, window:{__FLEET_AGENT__:agent,gtag:(...a)=>events.push(a)}});
  listeners.click({isTrusted:trusted,target:{closest:()=>a}});
  return {beacons,events,document};
}
function click(href, trusted = true, agent = false, pathname = '/tools/') {
  return runTracker(source, href, trusted, agent, pathname);
}
function assertAttribution(result, expectedClass) {
  assert.equal(result.beacons.length, 1);
  assert.equal(result.beacons[0].searchParams.get('f'),'tool');
  assert.equal(result.beacons[0].searchParams.get('p'), expectedClass);
  assert.equal(result.events[0][2].page_class, expectedClass);
}
for (const hub of ['tools','paintings','learn']) {
  assertAttribution(click('/go/p/B0BJ147GF9?c=hub-'+hub), 'hub-'+hub);
}
for (const currentClass of ['palette-destination', 'hub-tools-injected']) {
  assertAttribution(click('/go/p/B0BJ147GF9?c='+currentClass), currentClass);
}
for (const invalidClass of ['Hub-tools', 'hub/tools', '']) {
  assertAttribution(click('/go/p/B0BJ147GF9?c='+invalidClass), 'tools');
}
assertAttribution(click('/go/p/B0BJ147GF9'), 'tools');
const synthetic = click('/go/p/B0BJ147GF9?c=hub-tools',false);
assert.equal(synthetic.beacons.length,0);
assert.equal(synthetic.document.cookie,'');
assert.equal(click('/go/p/B0BJ147GF9?c=hub-tools',true,true).beacons[0].searchParams.get('a'),'1');

const brokenSource = source.replace(
  "if(/^[a-z0-9][a-z0-9-]{0,39}$/.test(c||''))pageClass=c;",
  'if(false)pageClass=c;'
);
assert.notEqual(brokenSource, source);
assert.throws(
  () => assertAttribution(runTracker(brokenSource, '/go/p/B0BJ147GF9?c=palette-destination'), 'palette-destination'),
  assert.AssertionError
);
console.log('PASS: valid format classes; pathname fallback for invalid/empty/missing c; tool shelf retained; synthetic event rejected; agent marker retained; broken-tracker negative control fails. No network.');
