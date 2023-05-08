import wilcoxon from '@stdlib/stats-wilcoxon';

import { mean, quantile } from 'simple-statistics';

import {
  AbstractFnParams,
  CollectorResult,
  ComparatorConfig,
  ComparatorResult,
  Sample,
} from './types';
import { COMPARE } from './constants';

export default class Comparator {
  private result: ComparatorResult;
  private config: ComparatorConfig;

  constructor(config: ComparatorConfig) {
    this.config = config;
    this.result = {};
  }

  private addPercentiles(
    firstSample: Sample,
    secondSample: Sample,
    traceTask: string
  ): void {
    const { percentiles } = this.config;

    for (let i = 0; i < percentiles.length; i++) {
      const percentile = percentiles[i];
      const name = `${percentile * 100}th percentile`;

      this.result[traceTask][name] = Comparator.subtractByFn(
        quantile,
        firstSample,
        secondSample,
        percentile
      );
    }
  }

  private addMean(
    firstSample: Sample,
    secondSample: Sample,
    traceTask: string
  ): void {
    this.result[traceTask][COMPARE.MEAN] = Comparator.subtractByFn(
      mean,
      firstSample,
      secondSample
    );
  }

  private addMannWhitney(
    firstSample: Sample,
    secondSample: Sample,
    traceTask: string
  ): void {
    const [rejected, pValue] = Comparator.testMannWhitney(
      firstSample,
      secondSample
    );

    this.result[traceTask][COMPARE.MW] = rejected;
    this.result[traceTask][COMPARE.P_VALUE] = pValue;
  }

  private addCount(traceTask: string, count: number): void {
    this.result[traceTask][COMPARE.COUNT] = count;
  }

  public compare(
    firstCollectorResult: CollectorResult,
    secondCollectorResult: CollectorResult
  ): ComparatorResult {
    for (const traceTask of Object.keys(firstCollectorResult)) {
      this.result[traceTask] = {};

      const firstSample = firstCollectorResult[traceTask];
      const secondSample = secondCollectorResult[traceTask];

      if (Array.isArray(this.config.percentiles)) {
        this.addPercentiles(firstSample, secondSample, traceTask);
      }

      if (this.config.mean) {
        this.addMean(firstSample, secondSample, traceTask);
      }

      if (this.config.mannWhitney) {
        this.addMannWhitney(firstSample, secondSample, traceTask);
      }

      if (this.config.count) {
        this.addCount(traceTask, firstSample.length);
      }
    }

    return this.result;
  }

  private static isSameLength(
    firstSample: Sample,
    secondSample: Sample
  ): boolean {
    return firstSample.length === secondSample.length;
  }

  private static isEveryElementEqual(
    firstSample: Sample,
    secondSample: Sample
  ): boolean {
    for (let i = 0; i < firstSample.length; i++) {
      if (firstSample[i] !== secondSample[i]) {
        return false;
      }
    }

    return true;
  }
  private static isEqualSamples(firstSample: Sample, secondSample: Sample) {
    return (
      Comparator.isSameLength(firstSample, secondSample) &&
      Comparator.isEveryElementEqual(firstSample, secondSample)
    );
  }

  private static isElementZero(element: number): boolean {
    return element === 0;
  }

  private static isEveryElementZero(sample: Sample): boolean {
    return sample.every(Comparator.isElementZero);
  }

  private static testMannWhitney(
    firstSample: Sample,
    secondSample: Sample
  ): [boolean, number] {
    const isFirstSelectionEveryElementZero =
      Comparator.isEveryElementZero(firstSample);
    const isSecondSelectionEveryElementZero =
      Comparator.isEveryElementZero(secondSample);

    const isEveryElementZero =
      isFirstSelectionEveryElementZero && isSecondSelectionEveryElementZero;

    const isEqualSamples = Comparator.isEqualSamples(firstSample, secondSample);

    if (isEveryElementZero || isEqualSamples) {
      return [false, 1];
    }

    const { rejected, pValue } = wilcoxon(firstSample, secondSample);

    return [rejected, pValue];
  }

  private static subtract(a: number, b: number): number {
    return a - b;
  }

  private static subtractByFn(
    fn: Function,
    firstSample: Sample,
    secondSample: Sample,
    ...abstractFnParams: AbstractFnParams
  ): number {
    const firstResult = fn(firstSample, ...abstractFnParams);
    const secondResult = fn(secondSample, ...abstractFnParams);

    return Comparator.subtract(firstResult, secondResult);
  }
}
