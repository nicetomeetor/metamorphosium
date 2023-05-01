import Comparator from '../lib/Comparator';

import { createCollectorResult } from './utils';

test('', () => {
  const firstCollectionResult = createCollectorResult([1, 2, 3, 4, 5]);
  const secondCollectionResult = createCollectorResult([1, 2, 3, 4, 5]);

  const result = Comparator.compare(
    firstCollectionResult,
    secondCollectionResult
  );

  expect(result.parseHTML.MW).toBeFalsy();
});
