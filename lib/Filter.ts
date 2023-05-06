import { quantile } from 'simple-statistics';

import { CollectorResult, Sample } from './types';

export default class Filter {
  private readonly coefficient: number;

  constructor(coefficient: number) {
    this.coefficient = coefficient;
  }

  private execute(sample: Sample): Sample {
    const q1 = quantile(sample, 0.25);
    const q3 = quantile(sample, 0.75);

    const iqr = q3 - q1;

    const maxValue = q3 + iqr * this.coefficient;
    const minValue = q1 - iqr * this.coefficient;

    const result = [];

    for (let i = 0; i < sample.length; i++) {
      if (sample[i] <= maxValue && sample[i] >= minValue) {
        result[i] = sample[i];
      } else {
        result[i] = NaN;
      }
    }

    return result;
  }

  public evaluate(
    firstResult: CollectorResult,
    secondResult: CollectorResult
  ): [CollectorResult, CollectorResult] {
    for (const task of Object.keys(firstResult)) {
      const firstSample = firstResult[task];
      const secondSample = secondResult[task];

      const firstFilteredSample = this.execute(firstSample);
      const secondFilteredSample = this.execute(secondSample);

      const [firstMatchedSample, secondMatchedSample] = Filter.match(
        firstFilteredSample,
        secondFilteredSample
      );

      firstResult[task] = firstMatchedSample;
      secondResult[task] = secondMatchedSample;
    }

    return [firstResult, secondResult];
  }

  public static match(
    firstSample: Sample,
    secondSample: Sample
  ): [Sample, Sample] {
    const firstMatchedSample = [];
    const secondMatchedSample = [];

    const minLength = Math.min(firstSample.length, secondSample.length);

    let j = 0;

    for (let i = 0; i < minLength; i++) {
      if (isNaN(firstSample[i]) || isNaN(secondSample[i])) {
        j++;
        continue;
      }

      firstMatchedSample[i - j] = firstSample[i];
      secondMatchedSample[i - j] = secondSample[i];
    }

    return [firstMatchedSample, secondMatchedSample];
  }
}
