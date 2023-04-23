import { quantile } from 'simple-statistics';

export default class Filter {
  public static process(array: number[]): number[] {
    const q1 = quantile(array, 0.25);
    const q3 = quantile(array, 0.75);
    const iqr = q3 - q1;
    const coef = 1.5;
    const maxValue = q3 + iqr * coef;
    const minValue = q1 - iqr * coef;

    const result = [];
    let diff = 0;

    for (let i = 0; i < array.length; i++) {
      if (array[i] <= maxValue && array[i] >= minValue) {
        result[i - diff] = array[i];
      } else {
        diff += 1;
      }
    }

    return result;
  }
}
