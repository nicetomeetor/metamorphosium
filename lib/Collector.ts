import tracium from 'tracium';

import cliProgress, { SingleBar } from 'cli-progress';

import { Cluster } from 'puppeteer-cluster';

import Logger from './Logger';

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

export default class Collector {
  private readonly collectorOptions: CollectorOptions;
  private readonly traceTasksSet: Set<TraceTask>;
  private readonly traceTasks: TraceTask[];

  private url: string;
  private result: CollectorResult;
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
    this.result = {};

    this.progress = new cliProgress.SingleBar(
      {
        format: `|{bar}| {value} / {total} ({percentage}%) Jobs`,
        hideCursor: true,
      },
      cliProgress.Presets.legacy
    );
  }

  public setUrl(url: string): void {
    this.url = url;
  }

  private static initialize(traceTasks: TraceTasks): CollectorResult {
    const result: CollectorResult = {};

    for (let i = 0; i < traceTasks.length; i++) {
      const traceTask = traceTasks[i];
      result[traceTask] = [];
    }

    return result;
  }

  public async evaluate(): Promise<CollectorResult> {
    this.result = Collector.initialize(this.traceTasks);

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

    return this.result;
  }

  private static async clusterTask({
    page,
    data: collector,
  }: TaskFunction<Collector>): Promise<void> {
    await page.tracing.start();

    await page.goto(collector.url, {
      waitUntil: PAGE.WAIT_UNTIL,
      timeout: PAGE.TIMEOUT,
    });

    const bufferTrace = (await page.tracing.stop())!;
    const stringTrace = bufferTrace.toString();
    const parsedTrace = JSON.parse(stringTrace);

    const tasks = tracium.computeMainThreadTasks(parsedTrace, {
      flatten: true,
    });

    const outcome: CollectorOutcome = collector.createOutcome();
    const updatedOutcome = collector.updateOutcomeByTasks(tasks, outcome);

    collector.updateResult(updatedOutcome);
    collector.progress.increment();
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
      const { kind, selfTime, startTime } = tasks[i];

      if (!this.traceTasksSet.has(kind)) {
        continue;
      }

      if (outcome[kind] === 0) {
        outcome[kind] = startTime + selfTime;
      } else {
        outcome[kind] += selfTime;
      }
    }

    return outcome;
  }

  private updateResult(collectorOutcome: CollectorOutcome): void {
    for (const [key, value] of Object.entries(collectorOutcome)) {
      const metric = this.result[key];
      metric[metric.length] = value;
    }
  }

  private static clusterTaskError(err: Error): void {
    Logger.print(err.message);
  }
}
