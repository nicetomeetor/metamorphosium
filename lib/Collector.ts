import tracium from 'tracium';

import cliProgress, { SingleBar } from 'cli-progress';

import { Cluster } from 'puppeteer-cluster';

import {
  TraceTasks,
  TraceTask,
  CollectorOptions,
  Indications,
  CollectorResult,
  CollectorOutcome,
} from './types';

import { PAGE_WAIT_UNTIL } from './constants';

export default class Collector {
  private readonly collectorOptions: CollectorOptions;
  private readonly indications: Indications;
  private readonly traceTasksSet: Set<TraceTask>;
  private readonly traceTasks: TraceTask[];
  private readonly metrics: CollectorResult;

  private progress: SingleBar;

  constructor(
    collectorOptions: CollectorOptions,
    indications: Indications,
    traceTasks: TraceTasks
  ) {
    this.collectorOptions = collectorOptions;
    this.indications = indications;
    this.traceTasksSet = new Set(traceTasks);
    this.traceTasks = traceTasks;

    this.metrics = Collector.initializeMetrics(traceTasks);

    this.progress = new cliProgress.SingleBar(
      {
        format: `|{bar}| {value} / {total} ({percentage}%) Jobs`,
        hideCursor: true,
      },
      cliProgress.Presets.legacy
    );
  }

  private static initializeMetrics(traceTasks: TraceTasks) {
    const metrics: CollectorResult = {};

    for (let i = 0; i < traceTasks.length; i++) {
      const traceTask = traceTasks[i];
      metrics[traceTask] = [];
    }

    return metrics;
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

      const outcome: CollectorOutcome = {};

      for (let i = 0; i < this.traceTasks.length; i++) {
        const traceTask = this.traceTasks[i];

        outcome[traceTask] = 0;
      }

      for (let i = 0; i < tasks.length; i++) {
        const { kind, selfTime } = tasks[i];

        if (!this.traceTasksSet.has(kind)) {
          continue;
        }

        outcome[kind] += selfTime;
      }

      for (const [key, value] of Object.entries(outcome)) {
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
