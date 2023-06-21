import Filter from '../lib/Filter';

import { createCollectorResult } from './utils';

test('removes one outlier from selection', () => {
  const firstCollectorResult = createCollectorResult([1, 2, 3, 4, 5, 100]);
  const secondCollectorResult = createCollectorResult([1, 2, 3, 4, 5, 100]);

  const filter = new Filter(1.5);

  const [firstFilteredSelection, secondFilteredSelection] = filter.evaluate(
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

test('removes two outliers from selection', () => {
  const firstCollectorResult = createCollectorResult([1, 2, 100, 4, 5]);
  const secondCollectorResult = createCollectorResult([1, 2, 3, 100, 5]);

  const filter = new Filter(1.5);

  const [firstFilteredSelection] = filter.evaluate(
    firstCollectorResult,
    secondCollectorResult
  );

  const arr = [1, 2, 5];

  const { parseHTML } = firstFilteredSelection;

  expect(parseHTML.toString()).toBe(arr.toString());
});

test('no selection outliers', () => {
  const arr = [0, 0, 0, 0, 0, 0];

  const firstCollectorResult = createCollectorResult(arr);
  const secondCollectorResult = createCollectorResult(arr);

  const filter = new Filter(1.5);

  const [firstFilteredSelection] = filter.evaluate(
    firstCollectorResult,
    secondCollectorResult
  );

  const { parseHTML } = firstFilteredSelection;

  expect(arr.toString()).toBe(parseHTML.toString());
});

test('removes three outliers from selection', () => {
  const firstArr = [
    501.844, 447.27200000000005, 18.911, 22.629999999999992, 18.201,
    34.62199999999999, 26.886000000000003, 32.846000000000004,
    21.733000000000004, 18.226999999999993,
  ];

  const secondArr = [
    501.844, 18.226999999999993, 18.911, 22.629999999999992, 18.201,
    34.62199999999999, 26.886000000000003, 32.846000000000004,
    21.733000000000004, 447.27200000000005,
  ];

  const result = [
    18.911, 22.629999999999992, 18.201, 34.62199999999999, 26.886000000000003,
    32.846000000000004, 21.733000000000004,
  ];

  const firstCollectorResult = createCollectorResult(firstArr);
  const secondCollectorResult = createCollectorResult(secondArr);

  const filter = new Filter(1.5);

  const [firstFilteredSelection] = filter.evaluate(
    firstCollectorResult,
    secondCollectorResult
  );

  const { parseHTML } = firstFilteredSelection;

  expect(result.toString()).toBe(parseHTML.toString());
});
