import Collector from './Collector';
import { TIME, INFO } from './constants';

const categories = [
  '-*',
  'toplevel',
  'blink.console',
  'blink.user_timing',
  'benchmark',
  'devtools.timeline',
  'disabled-by-default-blink.debug.layout',
  'disabled-by-default-devtools.timeline',
  'disabled-by-default-devtools.timeline.frame',
  'disabled-by-default-devtools.timeline.stack',
  'disabled-by-default-devtools.screenshot',
];

const url = 'https://pptr.dev/';

const indications = [
  'firstContentfulPaint',
  // 'firstMeaningFullPaint',
  'firstPaint',
  'ParseHTML',
  'domInteractive',
  'domComplete',
  'EvaluateScript',
  'RunTask',
  'loadEventEnd',
  'loadEventStart',
  'v8.compile',
];

async function get(url: string): Promise<void> {
  console.info(INFO.START);

  console.time(TIME.EXECUTION);

  const collector = new Collector(
    url,
    {
      maxConcurrency: 3,
      retryLimit: 10,
      number: 10,
    },
    indications
  );

  const result = await collector.start();

  console.log(result);

  console.timeEnd(TIME.EXECUTION);
}

const main = async () => get(url);

main();
