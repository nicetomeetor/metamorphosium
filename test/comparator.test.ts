import Comparator from '../lib/Comparator';

import { createCollectorResult } from './utils';

test('', () => {
  const firstCollectionResult = createCollectorResult([1, 2, 3, 4, 5]);
  const secondCollectionResult = createCollectorResult([1, 2, 3, 4, 5]);

  const percentiles = [0.25, 0.5, 0.75, 0.95];
  const mean = true;
  const mannWhitney = true;
  const count = true;

  const config = { percentiles, mean, mannWhitney, count };

  const comparator = new Comparator(config);

  const result = comparator.compare(
    firstCollectionResult,
    secondCollectionResult
  );

  expect(result.parseHTML.MW).toBeFalsy();
});
