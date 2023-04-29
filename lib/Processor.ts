import { writeFileSync } from 'node:fs';

import Collector, { CollectorOptions, Indications } from './Collector';
import Comparator from './Comparator';

import { FILE_NAME, INFO, TIME } from './constants';
import { TraceTasks } from './types';

export default class Processor {
  private readonly mainUrl: string;
  private readonly featureUrl: string;
  private readonly collectorOptions: CollectorOptions;
  private readonly indications: Indications;
  private readonly traceTasks: TraceTasks;

  constructor(
    mainUrl: string,
    featureUrl: string,
    collectorOptions: CollectorOptions,
    indications: Indications,
    traceTasks: TraceTasks
  ) {
    this.mainUrl = mainUrl;
    this.featureUrl = featureUrl;
    this.collectorOptions = collectorOptions;
    this.indications = indications;
    this.traceTasks = traceTasks;
  }

  public async evaluate(): Promise<void> {
    console.info(INFO.START);
    console.time(TIME.EXECUTION);

    const firstCollector = new Collector(
      this.collectorOptions,
      this.indications,
      this.traceTasks
    );
    const secondCollector = new Collector(
      this.collectorOptions,
      this.indications,
      this.traceTasks
    );

    console.info(INFO.FIRST_SELECTION);
    const firstSelection = await firstCollector.evaluate(this.mainUrl);
    const firstSelectionJsonString = JSON.stringify(firstSelection);

    console.time(TIME.WRITE_FIRST_SELECTION);
    writeFileSync(FILE_NAME.FIRST_SELECTION, firstSelectionJsonString);
    console.timeEnd(TIME.WRITE_FIRST_SELECTION);

    console.info(INFO.SECOND_SELECTION);
    const secondSelection = await secondCollector.evaluate(this.featureUrl);
    const secondSelectionJsonString = JSON.stringify(secondSelection);

    console.time(TIME.WRITE_SECOND_SELECTION);
    writeFileSync(FILE_NAME.SECOND_SELECTION, secondSelectionJsonString);
    console.timeEnd(TIME.WRITE_SECOND_SELECTION);

    const comparison = Comparator.compare(firstSelection, secondSelection);

    console.info(INFO.PRINT_TABLE);
    console.table(comparison);

    const comparisonJsonString = JSON.stringify(comparison);

    console.time(TIME.WRITE_RESULT);
    writeFileSync(FILE_NAME.RESULT, comparisonJsonString);
    console.timeEnd(TIME.WRITE_RESULT);

    console.info(INFO.END);
    console.timeEnd(TIME.EXECUTION);
  }
}
