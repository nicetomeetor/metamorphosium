import cliProgress, { SingleBar } from 'cli-progress';
import { Cluster } from 'puppeteer-cluster';
import { PuppeteerNodeLaunchOptions } from 'puppeteer';
import tracium from 'tracium';

import { TraceTasks, TraceTask } from './types';

import { EVENT_NAME, PAGE_WAIT_UNTIL } from './constants';

export type Indications = string[];

export type CollectorOptions = {
  maxConcurrency: number;
  retryLimit: number;
  number: number;
  timeout: number;
  puppeteerOptions: PuppeteerNodeLaunchOptions;
};

type TraceEvent = {
  name: string;
  args?: {
    data?: {
      documentLoaderURL?: string;
    };
  };
  ph: 'R' | 'X';
  dur: number;
  ts: number;
};

type CollectorOutcome = {
  [key: string]: number;
};

export type CollectorResult = {
  [key: string]: number[];
};

export default class Collector {
  private readonly collectorOptions: CollectorOptions;
  private readonly indications: Indications;
  private readonly traceTasksSet: Set<TraceTask>;
  private readonly traceTasks: TraceTask[];
  private metrics: CollectorResult;

  private progress: SingleBar;

  private time: number = 1000000;

  constructor(
    collectorOptions: CollectorOptions,
    indications: Indications,
    traceTasks: TraceTasks
  ) {
    this.collectorOptions = collectorOptions;
    this.indications = indications;
    this.traceTasksSet = new Set(traceTasks);
    this.traceTasks = traceTasks;
    this.metrics = {};

    this.progress = new cliProgress.SingleBar(
      {
        format: `|{bar}| {value} / {total} ({percentage}%) Jobs`,
        hideCursor: true,
      },
      cliProgress.Presets.legacy
    );

    this.initializeMetrics(traceTasks);
  }

  private initializeMetrics(traceTasks: TraceTasks) {
    this.metrics = {};

    for (let i = 0; i < traceTasks.length; i++) {
      const traceTask = traceTasks[i];
      this.metrics[traceTask] = [];
    }
  }

  private getTime(evt: number, ts: number): number {
    return (evt - ts) / this.time;
  }

  private getDuration(dur: number): number {
    return dur / this.time;
  }

  private getNavTime(url: string, traceEvents: TraceEvent[]): number {
    let ts = 0;

    for (let i = 0; i < traceEvents.length; i++) {
      const traceEvent = traceEvents[i];

      if (
        traceEvent.name === EVENT_NAME.NAVIGATION_START &&
        traceEvent?.args?.data?.documentLoaderURL?.includes(url)
      ) {
        ts = traceEvent.ts;
        break;
      }
    }

    return ts;
  }

  public async evaluate(url: string): Promise<CollectorResult> {
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_BROWSER,
      maxConcurrency: this.collectorOptions.maxConcurrency,
      retryLimit: this.collectorOptions.retryLimit,
      timeout: this.collectorOptions.timeout,
      puppeteerOptions: this.collectorOptions.puppeteerOptions,
    });

    const metrics: CollectorResult = {};

    for (let i = 0; i < this.indications.length; i++) {
      const indication = this.indications[i];
      metrics[indication] = [];
    }

    this.progress.start(this.collectorOptions.number, 0);

    await cluster.task(async ({ page, data }) => {
      await page.tracing.start();

      await page.goto(url, { waitUntil: PAGE_WAIT_UNTIL, timeout: 10000 });

      const bufferTrace = (await page.tracing.stop())!;
      const stringTrace = bufferTrace.toString();

      const parsedTrace = JSON.parse(stringTrace);

      const tasks = tracium.computeMainThreadTasks(parsedTrace, {
        flatten: true,
      });

      const outcome2: CollectorOutcome = {};

      for (let i = 0; i < this.traceTasks.length; i++) {
        const traceTask = this.traceTasks[i];

        outcome2[traceTask] = 0;
      }

      for (let i = 0; i < tasks.length; i++) {
        const { kind, selfTime } = tasks[i];

        if (!this.traceTasksSet.has(kind)) {
          continue;
        }

        outcome2[kind] += selfTime;
      }

      for (const [key, value] of Object.entries(outcome2)) {
        this.metrics[key].push(value);
      }

      this.progress.increment();
    });

    for (let i = 0; i < this.collectorOptions.number; i++) {
      cluster.queue(i);
    }

    cluster.on('taskerror', (err, data) => {
      // console.log(`\nError crawling ${data}: ${err.message}`);
    });

    await cluster.idle();
    await cluster.close();

    this.progress.stop();

    return this.metrics;
  }
}
