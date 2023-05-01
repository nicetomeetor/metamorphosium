import wilcoxon from '@stdlib/stats-wilcoxon';

import { mean, quantile } from 'simple-statistics';

import {
  AbstractFnParams,
  CollectorResult,
  ComparatorResult,
  Selection,
} from './types';
import { COMPARE, PERCENTILES } from './constants';

export default class Comparator {
  private static isSameLength(
    firstSelection: Selection,
    secondSelection: Selection
  ): boolean {
    return firstSelection.length === secondSelection.length;
  }

  private static isEveryElementEqual(
    firstSelection: Selection,
    secondSelection: Selection
  ): boolean {
    for (let i = 0; i < firstSelection.length; i++) {
      if (firstSelection[i] !== secondSelection[i]) {
        return false;
      }
    }

    return true;
  }
  private static isEqualSelections(
    firstSelection: Selection,
    secondSelection: Selection
  ) {
    return (
      Comparator.isSameLength(firstSelection, secondSelection) &&
      Comparator.isEveryElementEqual(firstSelection, secondSelection)
    );
  }

  private static isElementZero(element: number): boolean {
    return element === 0;
  }

  private static isEveryElementZero(selection: Selection): boolean {
    return selection.every(Comparator.isElementZero);
  }

  private static testMannWhitney(
    firstSelection: Selection,
    secondSelection: Selection
  ): [boolean, number] {
    const isFirstSelectionEveryElementZero =
      Comparator.isEveryElementZero(firstSelection);
    const isSecondSelectionEveryElementZero =
      Comparator.isEveryElementZero(secondSelection);

    const isEveryElementZero =
      isFirstSelectionEveryElementZero && isSecondSelectionEveryElementZero;

    const isEqualSelections = Comparator.isEqualSelections(
      firstSelection,
      secondSelection
    );

    if (isEveryElementZero || isEqualSelections) {
      return [false, 1];
    }

    const { rejected, pValue } = wilcoxon(firstSelection, secondSelection);

    return [rejected, pValue];
  }

  private static subtract(a: number, b: number): number {
    return a - b;
  }

  private static subtractByFn(
    fn: Function,
    firstSelection: Selection,
    secondSelection: Selection,
    ...abstractFnParams: AbstractFnParams
  ): number {
    const firstResult = fn(firstSelection, ...abstractFnParams);
    const secondResult = fn(secondSelection, ...abstractFnParams);

    return Comparator.subtract(firstResult, secondResult);
  }

  public static compare(
    firstCollectorResult: CollectorResult,
    secondCollectorResult: CollectorResult
  ): ComparatorResult {
    const comparatorResult: ComparatorResult = {};

    for (const key of Object.keys(firstCollectorResult)) {
      comparatorResult[key] = {};

      const firstCollectorKeyResult = firstCollectorResult[key];
      const secondCollectorKeyResult = secondCollectorResult[key];

      const percentiles = [
        { name: PERCENTILES.P95, param: 0.25 },
        { name: PERCENTILES.P50, param: 0.5 },
        { name: PERCENTILES.P75, param: 0.75 },
        { name: PERCENTILES.P95, param: 0.95 },
      ];

      for (let i = 0; i < percentiles.length; i++) {
        const percentile = percentiles[i];
        const { name, param } = percentile;

        comparatorResult[key][name] = Comparator.subtractByFn(
          quantile,
          firstCollectorKeyResult,
          secondCollectorKeyResult,
          param
        );
      }

      comparatorResult[key][COMPARE.MEAN] = Comparator.subtractByFn(
        mean,
        firstCollectorKeyResult,
        secondCollectorKeyResult
      );

      const [rejected, pValue] = Comparator.testMannWhitney(
        firstCollectorKeyResult,
        secondCollectorKeyResult
      );

      comparatorResult[key][COMPARE.MW] = rejected;
      comparatorResult[key][COMPARE.P_VALUE] = pValue;

      comparatorResult[key][COMPARE.COUNT] = firstCollectorKeyResult.length;
    }

    return comparatorResult;
  }
}
