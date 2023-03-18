"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const Collector_1 = __importDefault(require("./Collector"));
// @ts-ignore
const Comparator_1 = __importDefault(require("./Comparator"));
const constants_1 = require("./constants");
const node_fs_1 = require("node:fs");
const a = {
    firstContentfulPaint: [
        { name: 'firstContentfulPaint', value: 0.535887, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.608457, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.465689, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.348911, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.56345, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.305093, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.32749, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.534659, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.508051, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.470161, ph: 'R' },
    ],
    firstPaint: [
        { name: 'firstPaint', value: 0.535887, ph: 'R' },
        { name: 'firstPaint', value: 0.608457, ph: 'R' },
        { name: 'firstPaint', value: 0.465689, ph: 'R' },
        { name: 'firstPaint', value: 0.348911, ph: 'R' },
        { name: 'firstPaint', value: 0.56345, ph: 'R' },
        { name: 'firstPaint', value: 0.305093, ph: 'R' },
        { name: 'firstPaint', value: 0.32749, ph: 'R' },
        { name: 'firstPaint', value: 0.534659, ph: 'R' },
        { name: 'firstPaint', value: 0.508051, ph: 'R' },
        { name: 'firstPaint', value: 0.470161, ph: 'R' },
    ],
    ParseHTML: [
        { name: 'ParseHTML', value: 0.32620599999999983, ph: 'X' },
        { name: 'ParseHTML', value: 0.35041700000000003, ph: 'X' },
        { name: 'ParseHTML', value: 0.27769600000000005, ph: 'X' },
        { name: 'ParseHTML', value: 0.04630900000000001, ph: 'X' },
        { name: 'ParseHTML', value: 0.028759999999999994, ph: 'X' },
        { name: 'ParseHTML', value: 0.04030899999999998, ph: 'X' },
        { name: 'ParseHTML', value: 0.03620899999999999, ph: 'X' },
        { name: 'ParseHTML', value: 0.022427999999999997, ph: 'X' },
        { name: 'ParseHTML', value: 0.025833000000000002, ph: 'X' },
        { name: 'ParseHTML', value: 0.22218600000000005, ph: 'X' },
    ],
    domInteractive: [
        { name: 'domInteractive', value: 1.965713, ph: 'R' },
        { name: 'domInteractive', value: 2.05758, ph: 'R' },
        { name: 'domInteractive', value: 1.565976, ph: 'R' },
        { name: 'domInteractive', value: 1.591959, ph: 'R' },
        { name: 'domInteractive', value: 1.536174, ph: 'R' },
        { name: 'domInteractive', value: 1.530331, ph: 'R' },
        { name: 'domInteractive', value: 1.335865, ph: 'R' },
        { name: 'domInteractive', value: 1.316423, ph: 'R' },
        { name: 'domInteractive', value: 1.305523, ph: 'R' },
        { name: 'domInteractive', value: 1.265553, ph: 'R' },
    ],
    domComplete: [
        { name: 'domComplete', value: 2.302451, ph: 'R' },
        { name: 'domComplete', value: 2.388905, ph: 'R' },
        { name: 'domComplete', value: 1.637342, ph: 'R' },
        { name: 'domComplete', value: 1.658222, ph: 'R' },
        { name: 'domComplete', value: 1.600131, ph: 'R' },
        { name: 'domComplete', value: 1.599009, ph: 'R' },
        { name: 'domComplete', value: 1.392195, ph: 'R' },
        { name: 'domComplete', value: 1.367768, ph: 'R' },
        { name: 'domComplete', value: 1.354668, ph: 'R' },
        { name: 'domComplete', value: 1.315735, ph: 'R' },
    ],
    EvaluateScript: [
        { name: 'EvaluateScript', value: 1.024155, ph: 'X' },
        { name: 'EvaluateScript', value: 1.099329, ph: 'X' },
        { name: 'EvaluateScript', value: 0.957843, ph: 'X' },
        { name: 'EvaluateScript', value: 0.941773, ph: 'X' },
        { name: 'EvaluateScript', value: 0.909659, ph: 'X' },
        { name: 'EvaluateScript', value: 0.935258, ph: 'X' },
        { name: 'EvaluateScript', value: 0.792982, ph: 'X' },
        { name: 'EvaluateScript', value: 0.752078, ph: 'X' },
        { name: 'EvaluateScript', value: 0.751959, ph: 'X' },
        { name: 'EvaluateScript', value: 0.750646, ph: 'X' },
    ],
    RunTask: [
        { name: 'RunTask', value: 2.145777999999996, ph: 'X' },
        { name: 'RunTask', value: 2.190105999999999, ph: 'X' },
        { name: 'RunTask', value: 1.5549309999999996, ph: 'X' },
        { name: 'RunTask', value: 1.5340699999999985, ph: 'X' },
        { name: 'RunTask', value: 1.480176, ph: 'X' },
        { name: 'RunTask', value: 1.5186349999999984, ph: 'X' },
        { name: 'RunTask', value: 1.2745159999999975, ph: 'X' },
        { name: 'RunTask', value: 1.2206790000000016, ph: 'X' },
        { name: 'RunTask', value: 1.2497479999999985, ph: 'X' },
        { name: 'RunTask', value: 1.231423000000002, ph: 'X' },
    ],
    loadEventEnd: [
        { name: 'loadEventEnd', value: 2.317819, ph: 'R' },
        { name: 'loadEventEnd', value: 2.401476, ph: 'R' },
        { name: 'loadEventEnd', value: 1.650795, ph: 'R' },
        { name: 'loadEventEnd', value: 1.668982, ph: 'R' },
        { name: 'loadEventEnd', value: 1.60903, ph: 'R' },
        { name: 'loadEventEnd', value: 1.60971, ph: 'R' },
        { name: 'loadEventEnd', value: 1.40227, ph: 'R' },
        { name: 'loadEventEnd', value: 1.377239, ph: 'R' },
        { name: 'loadEventEnd', value: 1.363471, ph: 'R' },
        { name: 'loadEventEnd', value: 1.325754, ph: 'R' },
    ],
    loadEventStart: [
        { name: 'loadEventStart', value: 2.317804, ph: 'R' },
        { name: 'loadEventStart', value: 2.401464, ph: 'R' },
        { name: 'loadEventStart', value: 1.650119, ph: 'R' },
        { name: 'loadEventStart', value: 1.668972, ph: 'R' },
        { name: 'loadEventStart', value: 1.60902, ph: 'R' },
        { name: 'loadEventStart', value: 1.609699, ph: 'R' },
        { name: 'loadEventStart', value: 1.402263, ph: 'R' },
        { name: 'loadEventStart', value: 1.37723, ph: 'R' },
        { name: 'loadEventStart', value: 1.36346, ph: 'R' },
        { name: 'loadEventStart', value: 1.325746, ph: 'R' },
    ],
    'v8.compile': [
        { name: 'v8.compile', value: 0.013405999999999998, ph: 'X' },
        { name: 'v8.compile', value: 0.013506999999999998, ph: 'X' },
        { name: 'v8.compile', value: 0.006225, ph: 'X' },
        { name: 'v8.compile', value: 0.0068460000000000005, ph: 'X' },
        { name: 'v8.compile', value: 0.004587000000000001, ph: 'X' },
        { name: 'v8.compile', value: 0.004965999999999999, ph: 'X' },
        { name: 'v8.compile', value: 0.005640999999999999, ph: 'X' },
        { name: 'v8.compile', value: 0.007777999999999999, ph: 'X' },
        { name: 'v8.compile', value: 0.0065190000000000005, ph: 'X' },
        { name: 'v8.compile', value: 0.007386000000000001, ph: 'X' },
    ],
};
const b = {
    firstContentfulPaint: [
        { name: 'firstContentfulPaint', value: 0.647778, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.440062, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.377332, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.311659, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.484031, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.366054, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.316679, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.548195, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.301379, ph: 'R' },
        { name: 'firstContentfulPaint', value: 0.30307, ph: 'R' },
    ],
    firstPaint: [
        { name: 'firstPaint', value: 0.647778, ph: 'R' },
        { name: 'firstPaint', value: 0.440062, ph: 'R' },
        { name: 'firstPaint', value: 0.377332, ph: 'R' },
        { name: 'firstPaint', value: 0.311659, ph: 'R' },
        { name: 'firstPaint', value: 0.484031, ph: 'R' },
        { name: 'firstPaint', value: 0.366054, ph: 'R' },
        { name: 'firstPaint', value: 0.316679, ph: 'R' },
        { name: 'firstPaint', value: 0.548195, ph: 'R' },
        { name: 'firstPaint', value: 0.301379, ph: 'R' },
        { name: 'firstPaint', value: 0.30307, ph: 'R' },
    ],
    ParseHTML: [
        { name: 'ParseHTML', value: 0.025647000000000003, ph: 'X' },
        { name: 'ParseHTML', value: 0.25634999999999997, ph: 'X' },
        { name: 'ParseHTML', value: 0.24632700000000002, ph: 'X' },
        { name: 'ParseHTML', value: 0.26121499999999986, ph: 'X' },
        { name: 'ParseHTML', value: 0.029581000000000003, ph: 'X' },
        { name: 'ParseHTML', value: 0.278507, ph: 'X' },
        { name: 'ParseHTML', value: 0.044119, ph: 'X' },
        { name: 'ParseHTML', value: 0.029016999999999998, ph: 'X' },
        { name: 'ParseHTML', value: 0.031048000000000006, ph: 'X' },
        { name: 'ParseHTML', value: 0.036359999999999996, ph: 'X' },
    ],
    domInteractive: [
        { name: 'domInteractive', value: 1.586307, ph: 'R' },
        { name: 'domInteractive', value: 1.664737, ph: 'R' },
        { name: 'domInteractive', value: 1.578321, ph: 'R' },
        { name: 'domInteractive', value: 1.600403, ph: 'R' },
        { name: 'domInteractive', value: 1.56589, ph: 'R' },
        { name: 'domInteractive', value: 1.632937, ph: 'R' },
        { name: 'domInteractive', value: 1.4957, ph: 'R' },
        { name: 'domInteractive', value: 1.359753, ph: 'R' },
        { name: 'domInteractive', value: 1.296527, ph: 'R' },
        { name: 'domInteractive', value: 1.290697, ph: 'R' },
    ],
    domComplete: [
        { name: 'domComplete', value: 1.657105, ph: 'R' },
        { name: 'domComplete', value: 1.991034, ph: 'R' },
        { name: 'domComplete', value: 1.910344, ph: 'R' },
        { name: 'domComplete', value: 1.921667, ph: 'R' },
        { name: 'domComplete', value: 1.626746, ph: 'R' },
        { name: 'domComplete', value: 1.914929, ph: 'R' },
        { name: 'domComplete', value: 1.576471, ph: 'R' },
        { name: 'domComplete', value: 1.387973, ph: 'R' },
        { name: 'domComplete', value: 1.345037, ph: 'R' },
        { name: 'domComplete', value: 1.345645, ph: 'R' },
    ],
    EvaluateScript: [
        { name: 'EvaluateScript', value: 0.899697, ph: 'X' },
        { name: 'EvaluateScript', value: 0.904277, ph: 'X' },
        { name: 'EvaluateScript', value: 0.880682, ph: 'X' },
        { name: 'EvaluateScript', value: 0.952406, ph: 'X' },
        { name: 'EvaluateScript', value: 0.94798, ph: 'X' },
        { name: 'EvaluateScript', value: 0.945994, ph: 'X' },
        { name: 'EvaluateScript', value: 0.923806, ph: 'X' },
        { name: 'EvaluateScript', value: 0.732666, ph: 'X' },
        { name: 'EvaluateScript', value: 0.769041, ph: 'X' },
        { name: 'EvaluateScript', value: 0.7834990000000001, ph: 'X' },
    ],
    RunTask: [
        { name: 'RunTask', value: 1.4731090000000013, ph: 'X' },
        { name: 'RunTask', value: 1.8128659999999994, ph: 'X' },
        { name: 'RunTask', value: 1.7705899999999983, ph: 'X' },
        { name: 'RunTask', value: 1.845292999999999, ph: 'X' },
        { name: 'RunTask', value: 1.5125730000000002, ph: 'X' },
        { name: 'RunTask', value: 1.7971889999999993, ph: 'X' },
        { name: 'RunTask', value: 1.4812490000000011, ph: 'X' },
        { name: 'RunTask', value: 1.2691800000000002, ph: 'X' },
        { name: 'RunTask', value: 1.249259999999999, ph: 'X' },
        { name: 'RunTask', value: 1.2539639999999994, ph: 'X' },
    ],
    loadEventEnd: [
        { name: 'loadEventEnd', value: 1.670348, ph: 'R' },
        { name: 'loadEventEnd', value: 2.001258, ph: 'R' },
        { name: 'loadEventEnd', value: 1.920361, ph: 'R' },
        { name: 'loadEventEnd', value: 1.930781, ph: 'R' },
        { name: 'loadEventEnd', value: 1.638672, ph: 'R' },
        { name: 'loadEventEnd', value: 1.923191, ph: 'R' },
        { name: 'loadEventEnd', value: 1.587169, ph: 'R' },
        { name: 'loadEventEnd', value: 1.394366, ph: 'R' },
        { name: 'loadEventEnd', value: 1.354855, ph: 'R' },
        { name: 'loadEventEnd', value: 1.35484, ph: 'R' },
    ],
    loadEventStart: [
        { name: 'loadEventStart', value: 1.669976, ph: 'R' },
        { name: 'loadEventStart', value: 2.001248, ph: 'R' },
        { name: 'loadEventStart', value: 1.920344, ph: 'R' },
        { name: 'loadEventStart', value: 1.930769, ph: 'R' },
        { name: 'loadEventStart', value: 1.638659, ph: 'R' },
        { name: 'loadEventStart', value: 1.923184, ph: 'R' },
        { name: 'loadEventStart', value: 1.587155, ph: 'R' },
        { name: 'loadEventStart', value: 1.394348, ph: 'R' },
        { name: 'loadEventStart', value: 1.354846, ph: 'R' },
        { name: 'loadEventStart', value: 1.354831, ph: 'R' },
    ],
    'v8.compile': [
        { name: 'v8.compile', value: 0.006521, ph: 'X' },
        { name: 'v8.compile', value: 0.006481000000000001, ph: 'X' },
        { name: 'v8.compile', value: 0.005577000000000001, ph: 'X' },
        { name: 'v8.compile', value: 0.006389000000000001, ph: 'X' },
        { name: 'v8.compile', value: 0.0064919999999999995, ph: 'X' },
        { name: 'v8.compile', value: 0.005854000000000001, ph: 'X' },
        { name: 'v8.compile', value: 0.008519000000000002, ph: 'X' },
        { name: 'v8.compile', value: 0.006227999999999999, ph: 'X' },
        { name: 'v8.compile', value: 0.006411000000000001, ph: 'X' },
        { name: 'v8.compile', value: 0.007163000000000001, ph: 'X' },
    ],
};
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
function get(url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.info(constants_1.INFO.START);
        console.time(constants_1.TIME.EXECUTION);
        const collector = new Collector_1.default(url, {
            maxConcurrency: 3,
            retryLimit: 10,
            number: 10,
        }, indications);
        // const result = await collector.start();
        // console.log(result);
        const comparison = Comparator_1.default.compare(a, b);
        const comparisonJsonString = JSON.stringify(comparison);
        console.time(constants_1.TIME.WRITE_RESULT);
        (0, node_fs_1.writeFileSync)(constants_1.FILE_NAME.RESULT, comparisonJsonString);
        console.timeEnd(constants_1.TIME.WRITE_RESULT);
        console.timeEnd(constants_1.TIME.EXECUTION);
    });
}
const main = () => __awaiter(void 0, void 0, void 0, function* () { return get(url); });
main();
