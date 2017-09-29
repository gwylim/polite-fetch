import fetch from 'node-fetch';
import sleep from 'sleep-promise';
import { URL } from 'url';

const nextFetchTime = new Map();
let delay = 1000;

// Fetches a page, but makes sure that we behave well as a crawler by not
// requesting pages from the same host too fast
export default async function fetch(uri, init) {
  const host = new URL(uri).host;
  const currentTime = Date.now();
  const fetchTime = nextFetchTime.get(host) || currentTime;
  nextFetchTime.set(host, fetchTime + delay);
  if (fetchTime > currentTime) {
    await sleep(fetchTime - currentTime);
  }
  return await fetch(uri, init);
}
fetch.setDelay = (newDelay) => {
  delay = newDelay;
};
