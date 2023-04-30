import tracium from 'tracium';

import cliProgress, { SingleBar } from 'cli-progress';

import { Cluster } from 'puppeteer-cluster';

import {
  TraceTasks,
  TraceTask,
  CollectorOptions,
  CollectorResult,
  CollectorOutcome,
  TaskFunction,
  Tasks,
} from './types';

import { PAGE, CLUSTER } from './constants';
import { Logger } from './Logger';

export default class Collector {
  private readonly collectorOptions: CollectorOptions;
  private readonly traceTasksSet: Set<TraceTask>;
  private readonly traceTasks: TraceTask[];
  private readonly metrics: CollectorResult;
  private url: string;

  private progress: SingleBar;

  constructor(
    collectorOptions: CollectorOptions,
    traceTasks: TraceTasks,
    url: string
  ) {
    this.collectorOptions = collectorOptions;
    this.traceTasksSet = new Set(traceTasks);
    this.traceTasks = traceTasks;
    this.url = url;

    this.metrics = Collector.initializeMetrics(traceTasks);

    this.progress = new cliProgress.SingleBar(
      {
        format: `|{bar}| {value} / {total} ({percentage}%) Jobs`,
        hideCursor: true,
      },
      cliProgress.Presets.legacy
    );
  }

  public setUrl(url: string) {
    this.url = url;
  }

  private static initializeMetrics(traceTasks: TraceTasks) {
    const metrics: CollectorResult = {};

    for (let i = 0; i < traceTasks.length; i++) {
      const traceTask = traceTasks[i];
      metrics[traceTask] = [];
    }

    return metrics;
  }

  public async evaluate(): Promise<CollectorResult> {
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_BROWSER,
      maxConcurrency:
        this.collectorOptions.maxConcurrency || CLUSTER.MAX_CONCURRENCY,
      retryLimit: this.collectorOptions.retryLimit || CLUSTER.RETRY_LIMIT,
      timeout: this.collectorOptions.timeout || CLUSTER.TIMEOUT,
      puppeteerOptions: this.collectorOptions.puppeteerOptions,
    });

    this.progress.start(this.collectorOptions.number, 0);

    await cluster.task(Collector.clusterTask);

    for (let i = 0; i < this.collectorOptions.number; i++) {
      await cluster.queue(this);
    }

    cluster.on(CLUSTER.TASK_ERROR, Collector.clusterTaskError);

    await cluster.idle();
    await cluster.close();

    this.progress.stop();

    return this.metrics;
  }

  private static async clusterTask({ page, data }: TaskFunction<Collector>) {
    await page.tracing.start();

    await page.goto(data.url, {
      waitUntil: PAGE.WAIT_UNTIL,
      timeout: PAGE.TIMEOUT,
    });

    const bufferTrace = (await page.tracing.stop())!;
    const stringTrace = bufferTrace.toString();
    const parsedTrace = JSON.parse(stringTrace);

    const tasks = tracium.computeMainThreadTasks(parsedTrace, {
      flatten: true,
    });

    const outcome: CollectorOutcome = data.createOutcome();

    const update = data.updateOutcomeByTasks(tasks, outcome);

    data.updateResult(update);
    data.progress.increment();
  }

  private createOutcome(): CollectorOutcome {
    const outcome: CollectorOutcome = {};

    for (let i = 0; i < this.traceTasks.length; i++) {
      const traceTask = this.traceTasks[i];

      outcome[traceTask] = 0;
    }

    return outcome;
  }

  private updateOutcomeByTasks(
    tasks: Tasks,
    outcome: CollectorOutcome
  ): CollectorOutcome {
    for (let i = 0; i < tasks.length; i++) {
      const { kind, selfTime } = tasks[i];

      if (!this.traceTasksSet.has(kind)) {
        continue;
      }

      outcome[kind] += selfTime;
    }

    return outcome;
  }

  private updateResult(update: CollectorOutcome) {
    for (const [key, value] of Object.entries(update)) {
      const metric = this.metrics[key];
      metric[metric.length] = value;
    }
  }

  private static clusterTaskError(err: Error) {
    Logger.print(err.message);
  }
}
