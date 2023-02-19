import { Cluster } from 'puppeteer-cluster';

import { EVENT_NAME } from './constants';

export default class Collector {
  private url: string;
  private collectorOptions: any;
  private indications: any;
  // private categories: string[]

  constructor(url: string, collectorOptions: any, indications: any) {
    this.url = url;
    this.collectorOptions = collectorOptions;
    this.indications = indications;
  }

  private getTime(evt: number, ts: number) {
    return (evt - ts) / 1000000;
  }

  public async start() {
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_BROWSER,
      maxConcurrency: this.collectorOptions.maxConcurrency,
      retryLimit: this.collectorOptions.retryLimit,
      puppeteerOptions: {
        headless: true,
        args: ['--use-gl=egl'],
        // categories: this.categories,
      },
    });

    const metrics: any = {};

    for (let i = 0; i < this.indications.length; i++) {
      const indication = this.indications[i];
      metrics[indication] = [];
    }

    await cluster.task(async ({ page, data: id }) => {
      await page.tracing.start();

      await page.goto(this.url);

      const bufferTrace = (await page.tracing.stop())!;
      const stringTrace = bufferTrace.toString();
      const parsedTrace = JSON.parse(stringTrace);
      const traceEvents = parsedTrace.traceEvents;

      let ts = 0;

      for (let i = 0; i < traceEvents.length; i++) {
        const traceEvent = traceEvents[i];

        if (
          traceEvent.name === EVENT_NAME.NAVIGATION_START &&
          traceEvent.args.data.documentLoaderURL.includes(this.url)
        ) {
          ts = traceEvent.ts;
        } else if (this.indications.includes(traceEvent.name)) {
          const metric = metrics[traceEvent.name];

          metric.push({
            name: traceEvent.name,
            duration: this.getTime(traceEvent.ts, ts),
          });
        }
      }
    });

    for (let i = 0; i < this.collectorOptions.number; i++) {
      cluster.queue(i);
    }

    await cluster.idle();
    await cluster.close();

    return metrics;
  }
}
