import Filter from '../lib/Filter';

import { CollectorResult } from '../lib/types';

const createCollectorResult = (arr: number[]): CollectorResult => {
  return {
    parseHTML: arr,
  };
};

test('', () => {
  const firstCollectorResult = createCollectorResult([1, 2, 3, 4, 5, 100]);

  const secondCollectorResult = createCollectorResult([1, 2, 3, 4, 5, 100]);

  const [firstFilteredSelection, secondFilteredSelection] = Filter.process(
    firstCollectorResult,
    secondCollectorResult
  );

  const arr = [1, 2, 3, 4, 5];

  for (const value of Object.values(firstFilteredSelection)) {
    expect(value.toString()).toBe(arr.toString());
  }

  for (const value of Object.values(secondFilteredSelection)) {
    expect(value.toString()).toBe(arr.toString());
  }
});

test('', () => {
  const firstCollectorResult = createCollectorResult([1, 2, 100, 4, 5]);

  const secondCollectorResult = createCollectorResult([1, 2, 3, 100, 5]);

  const [firstFilteredSelection] = Filter.process(
    firstCollectorResult,
    secondCollectorResult
  );

  const arr = [1, 2, 5];

  for (const value of Object.values(firstFilteredSelection)) {
    expect(value.toString()).toBe(arr.toString());
  }
});

test('', () => {
  const arr = [0, 0, 0, 0, 0, 0];

  const firstCollectorResult = createCollectorResult(arr);
  const secondCollectorResult = createCollectorResult(arr);

  const [firstFilteredSelection] = Filter.process(
    firstCollectorResult,
    secondCollectorResult
  );

  for (const value of Object.values(firstFilteredSelection)) {
    expect(value.toString()).toBe(arr.toString());
  }
});
