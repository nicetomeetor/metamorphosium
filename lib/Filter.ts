import { quantile } from 'simple-statistics';

import { CollectorResult, Sample } from './types';

export default class Filter {
  public static process(
    firstResult: CollectorResult,
    secondResult: CollectorResult
  ): [CollectorResult, CollectorResult] {
    for (const task of Object.keys(firstResult)) {
      const firstFilteredSelection = Filter.execute(firstResult[task]);
      const secondFilteredSelection = Filter.execute(secondResult[task]);

      const [first, second] = Filter.match(
        firstFilteredSelection,
        secondFilteredSelection
      );

      firstResult[task] = first;
      secondResult[task] = second;
    }

    return [firstResult, secondResult];
  }

  public static match(
    firstSample: Sample,
    secondSample: Sample
  ): [Sample, Sample] {
    const first = [];
    const second = [];

    const minLength = Math.min(firstSample.length, secondSample.length);

    let j = 0;

    for (let i = 0; i < minLength; i++) {
      if (isNaN(firstSample[i]) || isNaN(secondSample[i])) {
        j++;
        continue;
      }

      first[i - j] = firstSample[i];
      second[i - j] = secondSample[i];
    }

    return [first, second];
  }

  private static execute(array: Sample): Sample {
    const q1 = quantile(array, 0.25);
    const q3 = quantile(array, 0.75);

    const iqr = q3 - q1;

    const coef = 1.5;

    const maxValue = q3 + iqr * coef;
    const minValue = q1 - iqr * coef;

    const result = [];

    for (let i = 0; i < array.length; i++) {
      if (array[i] <= maxValue && array[i] >= minValue) {
        result[i] = array[i];
      } else {
        result[i] = NaN;
      }
    }

    return result;
  }
}
