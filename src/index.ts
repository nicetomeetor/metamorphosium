import { Cluster } from 'puppeteer-cluster';

import { TIME, INFO, EVENT_NAME } from './constants';

const categories = [
  '-*',
  'toplevel',
  'blink.console',
  'blink.user_timing',
  'benchmark',
  'devtools.timeline',
  'disabled-by-default-blink.debug.layout',
  'disabled-by-default-devtools.timeline',
  'disabled-by-default-devtools.timeline.frame',
  'disabled-by-default-devtools.timeline.stack',
  'disabled-by-default-devtools.screenshot',
];

const url = 'https://google.com';

const indications = new Set(['firstContentfulPaint']);

async function get(url: string): Promise<void> {
  console.info(INFO.START);

  const puppeteerOptions = {
    headless: true,
    args: ['--use-gl=egl'],
    categories,
  };

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_BROWSER,
    maxConcurrency: 2,
    retryLimit: 2,
    puppeteerOptions,
  });

  await cluster.task(async ({ page, data: id }) => {
    await page.tracing.start();

    await page.goto(url);

    const bufferTrace = (await page.tracing.stop()) || {};
    const stringTrace = bufferTrace.toString();
    const parsedTrace = JSON.parse(stringTrace);
    const traceEvents = parsedTrace.traceEvents;

    let nav = 0;

    for (let i = 0; i < traceEvents.length; i++) {
      const traceEvent = traceEvents[i];

      if (
        traceEvent.name === EVENT_NAME.NAVIGATION_START &&
        traceEvent.args.data.documentLoaderURL.includes(url)
      ) {
        nav = traceEvent.ts;
      }

      if (indications.has(traceEvent.name)) {
        console.log(traceEvent.name, (traceEvent.ts - nav) / 1000000);
      }
    }
  });

  console.time(TIME.EXECUTION);

  for (let i = 0; i < 10; i++) {
    cluster.queue(i);
  }

  await cluster.idle();
  await cluster.close();

  console.timeEnd(TIME.EXECUTION);
}

const main = async () => get(url);

main();
