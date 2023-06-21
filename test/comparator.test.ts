import Comparator from '../lib/Comparator';

import { createCollectorResult } from './utils';

const percentiles = [0.25, 0.5, 0.75, 0.95];
const mean = true;
const mannWhitney = true;
const count = true;

const config = { percentiles, mean, mannWhitney, count };

const comparator = new Comparator(config);

test('checks Mann-Whitney falsy status', () => {
  const firstCollectionResult = createCollectorResult([1, 2, 3, 4, 5]);
  const secondCollectionResult = createCollectorResult([1, 2, 3, 4, 5]);

  const result = comparator.compare(
    firstCollectionResult,
    secondCollectionResult
  );

  expect(result.parseHTML.MW).toBeFalsy();
});

test('checks Mann-Whitney truthy status', () => {
  const firstCollectionResult = createCollectorResult([
    10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
  ]);
  const secondCollectionResult = createCollectorResult([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);

  const result = comparator.compare(
    firstCollectionResult,
    secondCollectionResult
  );

  expect(result.parseHTML.MW).toBeTruthy();
});
