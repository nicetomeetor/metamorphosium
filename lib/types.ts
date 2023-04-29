import { PuppeteerNodeLaunchOptions } from 'puppeteer';

export type TraceTask =
  | 'parseHTML'
  | 'styleLayout'
  | 'paintCompositeRender'
  | 'scriptParseCompile'
  | 'scriptEvaluation'
  | 'garbageCollection'
  | 'other';

export type TraceTasks = TraceTask[];

export type Indications = string[];

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

export type AbstractFnParam = any;
