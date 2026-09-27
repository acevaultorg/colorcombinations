import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../public/amazon-track.js', import.meta.url), 'utf8');
function click(href, trusted = true, agent = false) {
  const listeners = {}, beacons = [], events = [];
  const a = Object.assign(new URL(href, 'https://colorcombinations.org'), {dataset:{tool:'Color guide'}});
  const document = {cookie:'',addEventListener:(name,fn)=>listeners[name]=fn};
  vm.runInNewContext(source, {URL, document, location:new URL('https://colorcombinations.org/tools/'),
    navigator:{sendBeacon:url=>beacons.push(new URL(url))}, window:{__FLEET_AGENT__:agent,gtag:(...a)=>events.push(a)}});
  listeners.click({isTrusted:trusted,target:{closest:()=>a}});
  return {beacons,events,document};
}
for (const hub of ['tools','paintings','learn']) {
  const {beacons,events}=click('/go/p/B0BJ147GF9?c=hub-'+hub);
  assert.equal(beacons.length,1); assert.equal(beacons[0].searchParams.get('f'),'tool');
  assert.equal(beacons[0].searchParams.get('p'),'hub-'+hub);
  assert.equal(events[0][2].page_class,'hub-'+hub);
}
assert.equal(click('/go/p/B0BJ147GF9?c=palette-destination').beacons[0].searchParams.has('p'),false);
assert.equal(click('/go/p/B0BJ147GF9?c=hub-tools-injected').beacons[0].searchParams.has('p'),false);
assert.equal(click('/go/p/B0BJ147GF9?c=hub-tools',false).beacons.length,0);
assert.equal(click('/go/p/B0BJ147GF9?c=hub-tools',false).document.cookie,'');
assert.equal(click('/go/p/B0BJ147GF9?c=hub-tools',true,true).beacons[0].searchParams.get('a'),'1');
console.log('PASS: three hub labels; historical shelf retained; unknown labels excluded; synthetic event rejected; agent marker retained. No network.');
