import Comparator from './Comparator';
import Collector from './Collector';
import Filter from './Filter';
import Logger from './Logger';

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

    collector.setUrl(this.featureUrl);

    console.info(INFO.SECOND_EXPERIMENT);
    const secondSelection = await collector.evaluate();

    const filter = new Filter(1.5);

    const [firstFilteredSelection, secondFirstSelection] = filter.evaluate(
      firstSelection,
      secondSelection
    );

    const percentiles = [0.25, 0.5, 0.75, 0.95];
    const mean = true;
    const mannWhitney = true;
    const count = true;

    const comparator = new Comparator({
      percentiles,
      mean,
      mannWhitney,
      count,
    });

    const comparison = comparator.compare(
      firstFilteredSelection,
      secondFirstSelection
    );

    console.info(INFO.PRINT_TABLE);
    console.table(comparison);

    console.info(INFO.END);
    console.timeEnd(TIME.EXECUTION);

    const firstSampleJsonString = JSON.stringify(firstSelection);
    const secondSampleJsonString = JSON.stringify(secondSelection);
    const comparisonJsonString = JSON.stringify(comparison);

    Logger.write(
      TIME.WRITE_FIRST_EXPERIMENT,
      FILE_NAME.FIRST_EXPERIMENT,
      firstSampleJsonString
    );

    Logger.write(
      TIME.WRITE_SECOND_EXPERIMENT,
      FILE_NAME.SECOND_EXPERIMENT,
      secondSampleJsonString
    );

    Logger.write(TIME.WRITE_RESULT, FILE_NAME.RESULT, comparisonJsonString);
  }
}
