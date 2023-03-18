import wilcoxon from '@stdlib/stats-wilcoxon';
import { mean, quantile } from 'simple-statistics';

const diff = (a: number, b: number): number => a - b;

const abstract = (f: Function, fi: number[], s: number[], ...params: any[]) => {
  const first = f(fi, ...params);
  const second = f(s, ...params);
  return diff(first, second);
};

export default class Comparator {
  public static compare(first: any, second: any) {
    const res: any = {};
    for (const key of Object.keys(first)) {
      res[key] = {};

      const f = this.toArray(first[key]);
      const s = this.toArray(second[key]);

      const { rejected } = wilcoxon(f, s);

      res[key]['status'] = rejected;
      res[key]['p25'] = abstract(quantile, f, s, 0.25);
      res[key]['p50'] = abstract(quantile, f, s, 0.5);
      res[key]['p75'] = abstract(quantile, f, s, 0.75);
      res[key]['p95'] = abstract(quantile, f, s, 0.95);
      res[key]['mean'] = abstract(mean, f, s);
    }

    return res;
  }
  constructor() {}

  private static toArray(array: any[]): any[] {
    const newArray = [];

    for (let i = 0; i < array.length; i++) {
      newArray[i] = array[i].value;
    }

    return newArray;
  }
}
