<p align="center">
    <img alt="logo" width="200" height="200" src="assets/logo.svg">
</p>

# Metamorphosium

Collect and compare trace events. Can be used in CI.

```js
const pkg = require('metamorphosium/build');

const { Processor } = pkg;

const mainUrl = 'http://main.com';
const featureUrl = 'http://feature.com';

const traceTasks = [
  'parseHTML',
  'styleLayout',
  'paintCompositeRender',
  'scriptParseCompile',
  'scriptEvaluation',
  'garbageCollection',
];

const args = ['--use-gl=egl'];

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

const collectorOptions = {
  maxConcurrency: 3,
  retryLimit: 10,
  number: 20,
  timeout: 10000,
  puppeteerOptions: {
    ignoreHTTPSErrors: true,
    args,
    categories,
    headless: 'new',
  },
};

const processor = new Processor(
  mainUrl,
  featureUrl,
  collectorOptions,
  traceTasks
);

processor.evaluate();
```
