import wilcoxon from '@stdlib/stats-wilcoxon';
import { mean, quantile } from 'simple-statistics';

import { CollectorResult } from './Collector';

type ComparatorOutCome = {
  [key: string]: number | boolean;
};

type ComparatorResult = {
  [key: string]: ComparatorOutCome;
};

type AbstractParam = any;

export default class Comparator {
  private static diff(a: number, b: number): number {
    return a - b;
  }

  private static abstractDiffByFunc(
    func: Function,
    first: number[],
    second: number[],
    ...params: AbstractParam[]
  ) {
    const firstResult = func(first, ...params);
    const secondResult = func(second, ...params);

    return Comparator.diff(firstResult, secondResult);
  }
  public static compare(
    firstCollectorResult: CollectorResult,
    secondCollectorResult: CollectorResult
  ): ComparatorResult {
    const result: ComparatorResult = {};

    for (const key of Object.keys(firstCollectorResult)) {
      result[key] = {};

      const firstCollectorKeyResult = firstCollectorResult[key];
      const secondCollectorKeyResult = secondCollectorResult[key];

      result[key]['p25'] = Comparator.abstractDiffByFunc(
        quantile,
        firstCollectorKeyResult,
        secondCollectorKeyResult,
        0.25
      );
      result[key]['p50'] = Comparator.abstractDiffByFunc(
        quantile,
        firstCollectorKeyResult,
        secondCollectorKeyResult,
        0.5
      );
      result[key]['p75'] = Comparator.abstractDiffByFunc(
        quantile,
        firstCollectorKeyResult,
        secondCollectorKeyResult,
        0.75
      );
      result[key]['p95'] = Comparator.abstractDiffByFunc(
        quantile,
        firstCollectorKeyResult,
        secondCollectorKeyResult,
        0.95
      );
      result[key]['mean'] = Comparator.abstractDiffByFunc(
        mean,
        firstCollectorKeyResult,
        secondCollectorKeyResult
      );

      const { rejected, pValue } = wilcoxon(
        firstCollectorKeyResult,
        secondCollectorKeyResult
      );

      result[key]['mw status'] = rejected;
      result[key]['mw p-value'] = pValue;
    }

    return result;
  }
}
