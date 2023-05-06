import { writeFileSync } from 'node:fs';

import Comparator from './Comparator';
import Collector from './Collector';
import Filter from './Filter';

import { CollectorOptions, TraceTasks } from './types';
import { FILE_NAME, INFO, TIME } from './constants';

export default class Processor {
  private readonly mainUrl: string;
  private readonly featureUrl: string;
  private readonly collectorOptions: CollectorOptions;
  private readonly traceTasks: TraceTasks;

  constructor(
    mainUrl: string,
    featureUrl: string,
    collectorOptions: CollectorOptions,
    traceTasks: TraceTasks
  ) {
    this.mainUrl = mainUrl;
    this.featureUrl = featureUrl;
    this.collectorOptions = collectorOptions;
    this.traceTasks = traceTasks;
  }

  public async evaluate(): Promise<void> {
    console.info(INFO.START);
    console.time(TIME.EXECUTION);

    const collector = new Collector(
      this.collectorOptions,
      this.traceTasks,
      this.mainUrl
    );

    console.info(INFO.FIRST_EXPERIMENT);
    const firstSelection = await collector.evaluate();
    const firstSelectionJsonString = JSON.stringify(firstSelection);

    collector.setUrl(this.featureUrl);

    console.info(INFO.SECOND_EXPERIMENT);
    const secondSelection = await collector.evaluate();
    const secondSelectionJsonString = JSON.stringify(secondSelection);

    const filter = new Filter(1.5);

    const [firstFilteredSelection, secondFirstSelection] = filter.evaluate(
      firstSelection,
      secondSelection
    );

    const comparator = new Comparator();

    const comparison = comparator.compare(
      firstFilteredSelection,
      secondFirstSelection
    );

    console.info(INFO.PRINT_TABLE);
    console.table(comparison);

    console.info(INFO.END);
    console.timeEnd(TIME.EXECUTION);

    const comparisonJsonString = JSON.stringify(comparison);

    console.time(TIME.WRITE_FIRST_EXPERIMENT);
    writeFileSync(FILE_NAME.FIRST_EXPERIMENT, firstSelectionJsonString);
    console.timeEnd(TIME.WRITE_FIRST_EXPERIMENT);

    console.time(TIME.WRITE_SECOND_EXPERIMENT);
    writeFileSync(FILE_NAME.SECOND_EXPERIMENT, secondSelectionJsonString);
    console.timeEnd(TIME.WRITE_SECOND_EXPERIMENT);

    console.time(TIME.WRITE_RESULT);
    writeFileSync(FILE_NAME.RESULT, comparisonJsonString);
    console.timeEnd(TIME.WRITE_RESULT);
  }
}
