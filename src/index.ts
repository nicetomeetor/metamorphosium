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

const url = 'https://www.google.com';

const indications = ['firstContentfulPaint'];

async function get(url: string): Promise<void> {
  console.info(INFO.START);

  console.time(TIME.EXECUTION);

  const collector = new Collector(
    url,
    {
      maxConcurrency: 2,
      retryLimit: 2,
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
