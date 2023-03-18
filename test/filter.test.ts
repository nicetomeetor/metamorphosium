import Filter from '../lib/Filter';

test('', () => {
  const arrayToFilter = [1, 2, 3, 4, 5, 6, 8, 9, 100];
  const res = Filter.process(arrayToFilter);
  expect(res.toString()).toBe([1, 2, 3, 4, 5, 6, 8, 9].toString());
});

test('', () => {
  const arrayToFilter = [1, 2, 3, 4, 5, 6, 8, 9];
  const res = Filter.process(arrayToFilter);
  expect(res.toString()).toBe([1, 2, 3, 4, 5, 6, 8, 9].toString());
});
