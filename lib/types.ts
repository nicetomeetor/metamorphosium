import { Page, PuppeteerNodeLaunchOptions } from 'puppeteer';

export type TraceTask =
  | 'parseHTML'
  | 'styleLayout'
  | 'paintCompositeRender'
  | 'scriptParseCompile'
  | 'scriptEvaluation'
  | 'garbageCollection'
  | 'other';

export type TraceTasks = TraceTask[];

export type CollectorOptions = {
  maxConcurrency: number;
  retryLimit: number;
  number: number;
  timeout: number;
  puppeteerOptions: PuppeteerNodeLaunchOptions;
};

export type CollectorOutcome = {
  [key: string]: number;
};

export type CollectorResult = {
  [key: string]: number[];
};

export type ComparatorOutCome = {
  [key: string]: number | boolean;
};

export type ComparatorResult = {
  [key: string]: ComparatorOutCome;
};

export type AbstractFnParam = unknown;

export type AbstractFnParams = AbstractFnParam[];

export type TaskFunction<JobData> = {
  page: Page;
  data: JobData;
  worker: {
    id: number;
  };
};

export type Task = {
  kind: TraceTask;
  startTime: number;
  endTime: number;
  duration: number;
  selfTime: number;
  event: {
    name: string;
  };
};

export type Tasks = Task[];

export type Sample = number[];
