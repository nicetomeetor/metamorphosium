import Collector from './Collector';
import Comparator from './Comparator';
import { TIME, INFO, FILE_NAME } from './constants';
import { writeFileSync } from 'node:fs';

type Indications = string[];

type CollectorOptions = {
  maxConcurrency: number;
  retryLimit: number;
  number: number;
};

export async function carrier(
  mainUrl: string,
  featureUrl: string,
  collectorOptions: CollectorOptions,
  indications: Indications
): Promise<void> {
  console.info(INFO.START);
  console.time(TIME.EXECUTION);

  const collector = new Collector(collectorOptions, indications);

  console.info(INFO.FIRST_SELECTION);
  const firstSelection = await collector.start(mainUrl);

  console.info(INFO.SECOND_SELECTION);
  const secondSelection = await collector.start(featureUrl);

  const comparison = Comparator.compare(firstSelection, secondSelection);

  console.table(comparison);

  const comparisonJsonString = JSON.stringify(comparison);

  console.time(TIME.WRITE_RESULT);
  writeFileSync(FILE_NAME.RESULT, comparisonJsonString);
  console.info(INFO.END);

  console.timeEnd(TIME.WRITE_RESULT);
  console.timeEnd(TIME.EXECUTION);
}
