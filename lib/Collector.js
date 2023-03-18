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
const puppeteer_cluster_1 = require("puppeteer-cluster");
const cli_progress_1 = __importDefault(require("cli-progress"));
const constants_1 = require("./constants");
class Collector {
    // private categories: string[]
    constructor(url, collectorOptions, indications) {
        this.progress = new cli_progress_1.default.SingleBar({}, cli_progress_1.default.Presets.shades_classic);
        this.time = 1000000;
        this.cursor = 0;
        this.navTime = 0;
        this.url = url;
        this.collectorOptions = collectorOptions;
        this.indications = indications;
    }
    getTime(evt, ts) {
        return (evt - ts) / this.time;
    }
    getDuration(dur) {
        return dur / this.time;
    }
    getNavTime(traceEvents) {
        let ts = 0;
        for (let i = 0; i < traceEvents.length; i++) {
            const traceEvent = traceEvents[i];
            if (traceEvent.name === constants_1.EVENT_NAME.NAVIGATION_START &&
                traceEvent.args.data.documentLoaderURL.includes(this.url)) {
                ts = traceEvent.ts;
                break;
            }
        }
        return ts;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const cluster = yield puppeteer_cluster_1.Cluster.launch({
                concurrency: puppeteer_cluster_1.Cluster.CONCURRENCY_BROWSER,
                maxConcurrency: this.collectorOptions.maxConcurrency,
                retryLimit: this.collectorOptions.retryLimit,
                timeout: 10000,
                puppeteerOptions: {
                    args: ['--use-gl=egl'],
                    // categories: this.categories,
                },
            });
            const metrics = {};
            for (let i = 0; i < this.indications.length; i++) {
                const indication = this.indications[i];
                metrics[indication] = [];
            }
            this.progress.start(this.collectorOptions.number, 0);
            yield cluster.task(({ page, data: index }) => __awaiter(this, void 0, void 0, function* () {
                yield page.tracing.start();
                // await page.setDefaultTimeout(0);
                // await page.setDefaultNavigationTimeout(0);
                const client = yield page.target().createCDPSession();
                yield client.send('Network.clearBrowserCache');
                yield client.send('Network.clearBrowserCookies');
                yield page.goto(this.url, { waitUntil: 'load' });
                const bufferTrace = (yield page.tracing.stop());
                const stringTrace = bufferTrace.toString();
                const parsedTrace = JSON.parse(stringTrace);
                const traceEvents = parsedTrace.traceEvents;
                let ts = this.getNavTime(traceEvents);
                const obj = {};
                for (let i = 0; i < this.indications.length; i++) {
                    obj[this.indications[i]] = {
                        name: this.indications[i],
                        value: 0,
                        ph: '',
                    };
                }
                for (let i = 0; i < traceEvents.length; i++) {
                    const traceEvent = traceEvents[i];
                    if (!this.indications.includes(traceEvent.name)) {
                        continue;
                    }
                    if (traceEvent.ph === 'R') {
                        obj[traceEvent.name].value = this.getTime(traceEvent.ts, ts);
                        obj[traceEvent.name].ph = traceEvent.ph;
                    }
                    else if (traceEvent.ph === 'X') {
                        obj[traceEvent.name].value += this.getDuration(traceEvent.dur);
                        obj[traceEvent.name].ph = traceEvent.ph;
                    }
                }
                for (const [key, value] of Object.entries(obj)) {
                    metrics[key].push(value);
                }
                this.progress.increment();
            }));
            for (let i = 0; i < this.collectorOptions.number; i++) {
                cluster.queue(i);
            }
            yield cluster.idle();
            yield cluster.close();
            this.progress.stop();
            return metrics;
        });
    }
}
exports.default = Collector;
