import { Cluster } from 'puppeteer-cluster';
import cliProgress from 'cli-progress';
import * as fs from 'fs';
import Tracium from 'tracium';

import { EVENT_NAME } from './constants';

export default class Collector {
  private readonly url: string;
  private collectorOptions: any;
  private readonly indications: any;

  private progress: any = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );

  private time: number = 1000000;
  private cursor: number = 0;
  private navTime: number = 0;

  // private categories: string[]

  constructor(url: string, collectorOptions: any, indications: any) {
    this.url = url;
    this.collectorOptions = collectorOptions;
    this.indications = indications;
  }

  private getTime(evt: number, ts: number) {
    return (evt - ts) / this.time;
  }

  private getDuration(dur: number) {
    return dur / this.time;
  }

  private getNavTime(traceEvents: any[]) {
    let ts = 0;

    for (let i = 0; i < traceEvents.length; i++) {
      const traceEvent = traceEvents[i];

      if (
        traceEvent.name === EVENT_NAME.NAVIGATION_START &&
        traceEvent.args.data.documentLoaderURL.includes(this.url)
      ) {
        ts = traceEvent.ts;
        break;
      }
    }

    return ts;
  }

  public async start() {
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_BROWSER,
      maxConcurrency: this.collectorOptions.maxConcurrency,
      retryLimit: this.collectorOptions.retryLimit,
      timeout: 10000,
      puppeteerOptions: {
        args: ['--use-gl=egl'],
        // categories: this.categories,
      },
    });

    const metrics: any = {};

    for (let i = 0; i < this.indications.length; i++) {
      const indication = this.indications[i];
      metrics[indication] = [];
    }

    this.progress.start(this.collectorOptions.number, 0);

    await cluster.task(async ({ page, data: index }) => {
      await page.tracing.start();

      // await page.setDefaultTimeout(0);
      // await page.setDefaultNavigationTimeout(0);

      const client = await page.target().createCDPSession();

      await client.send('Network.clearBrowserCache');
      await client.send('Network.clearBrowserCookies');

      await page.goto(this.url, { waitUntil: 'load' });

      const bufferTrace = (await page.tracing.stop())!;
      const stringTrace = bufferTrace.toString();

      const parsedTrace = JSON.parse(stringTrace);

      const traceEvents = parsedTrace.traceEvents;

      let ts = this.getNavTime(traceEvents);

      const obj: any = {};

      for (let i = 0; i < this.indications.length; i++) {
        obj[this.indications[i]] = {
          name: this.indications[i],
          value: 0,
          ph: '',
        };
      }

      for (let i = 0; i < traceEvents.length; i++) {
        const traceEvent = traceEvents[i];

        if (!this.indications.includes(traceEvent.name)) {
          continue;
        }

        if (traceEvent.ph === 'R') {
          obj[traceEvent.name].value = this.getTime(traceEvent.ts, ts);
          obj[traceEvent.name].ph = traceEvent.ph;
        } else if (traceEvent.ph === 'X') {
          obj[traceEvent.name].value += this.getDuration(traceEvent.dur);
          obj[traceEvent.name].ph = traceEvent.ph;
        }
      }

      for (const [key, value] of Object.entries(obj)) {
        metrics[key].push(value);
      }

      this.progress.increment();
    });

    for (let i = 0; i < this.collectorOptions.number; i++) {
      cluster.queue(i);
    }

    await cluster.idle();
    await cluster.close();
    this.progress.stop();

    return metrics;
  }
}
