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

      const percentiles = [
        { name: 'p25', param: 0.25 },
        { name: 'p50', param: 0.5 },
        { name: 'p75', param: 0.75 },
        { name: 'p95', param: 0.95 },
      ];

      for (let i = 0; i < percentiles.length; i++) {
        const name = percentiles[i].name;
        const param = percentiles[i].param;

        result[key][name] = Comparator.abstractDiffByFunc(
          quantile,
          firstCollectorKeyResult,
          secondCollectorKeyResult,
          param
        );
      }

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
