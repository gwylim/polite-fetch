import node_fetch from 'node-fetch';
import sleep from 'sleep-promise';
import { URL } from 'url';

const nextFetchTime = new Map();
let delay = 1000;

// Fetches a page, but makes sure that we behave well as a crawler by not
// requesting pages from the same host too fast
async function fetch(uri, init) {
  const host = new URL(uri).host;
  const currentTime = Date.now();
  const fetchTime = Math.max(nextFetchTime.get(host) || 0, currentTime);
  nextFetchTime.set(host, fetchTime + delay);
  if (fetchTime > currentTime) {
    await sleep(fetchTime - currentTime);
  }
  return await node_fetch(uri, init);
}

fetch.setDelay = (newDelay) => {
  delay = newDelay;
};

export default fetch;
