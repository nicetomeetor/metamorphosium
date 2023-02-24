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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var puppeteer_cluster_1 = require("puppeteer-cluster");
var cli_progress_1 = require("cli-progress");
var fs_1 = require("fs");
var tracium_1 = require("tracium");
var constants_1 = require("./constants");
var Collector = /** @class */ (function () {
    // private categories: string[]
    function Collector(url, collectorOptions, indications) {
        this.progress = new cli_progress_1["default"].SingleBar({}, cli_progress_1["default"].Presets.shades_classic);
        this.url = url;
        this.collectorOptions = collectorOptions;
        this.indications = indications;
    }
    Collector.prototype.getTime = function (evt, ts) {
        return (evt - ts) / 1000000;
    };
    Collector.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cluster, metrics, i, indication, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, puppeteer_cluster_1.Cluster.launch({
                            concurrency: puppeteer_cluster_1.Cluster.CONCURRENCY_BROWSER,
                            maxConcurrency: this.collectorOptions.maxConcurrency,
                            retryLimit: this.collectorOptions.retryLimit,
                            timeout: 5000,
                            puppeteerOptions: {
                                headless: true,
                                args: ['--use-gl=egl']
                            }
                        })];
                    case 1:
                        cluster = _a.sent();
                        metrics = {};
                        for (i = 0; i < this.indications.length; i++) {
                            indication = this.indications[i];
                            metrics[indication] = [];
                        }
                        // await this.progress.start();
                        return [4 /*yield*/, cluster.task(function (_a) {
                                var page = _a.page, id = _a.data;
                                return __awaiter(_this, void 0, void 0, function () {
                                    var client, bufferTrace, stringTrace, parsedTrace, tasks, totalScriptTime, _i, tasks_1, task, traceEvents, ts, i, traceEvent, metric;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, page.tracing.start()];
                                            case 1:
                                                _b.sent();
                                                return [4 /*yield*/, page.setDefaultTimeout(0)];
                                            case 2:
                                                _b.sent();
                                                return [4 /*yield*/, page.setDefaultNavigationTimeout(0)];
                                            case 3:
                                                _b.sent();
                                                return [4 /*yield*/, page.target().createCDPSession()];
                                            case 4:
                                                client = _b.sent();
                                                return [4 /*yield*/, client.send('Network.clearBrowserCache')];
                                            case 5:
                                                _b.sent();
                                                return [4 /*yield*/, client.send('Network.clearBrowserCookies')];
                                            case 6:
                                                _b.sent();
                                                return [4 /*yield*/, page.goto(this.url, { waitUntil: 'load', timeout: 0 })];
                                            case 7:
                                                _b.sent();
                                                return [4 /*yield*/, page.tracing.stop()];
                                            case 8:
                                                bufferTrace = (_b.sent());
                                                stringTrace = bufferTrace.toString();
                                                parsedTrace = JSON.parse(stringTrace);
                                                tasks = tracium_1["default"].computeMainThreadTasks(parsedTrace, {
                                                    // |flatten| default to |false|. When false, only top-level tasks will be returned.
                                                    flatten: true
                                                });
                                                totalScriptTime = 0;
                                                for (_i = 0, tasks_1 = tasks; _i < tasks_1.length; _i++) {
                                                    task = tasks_1[_i];
                                                    if (task.kind === 'scriptEvaluation' ||
                                                        task.kind === 'scriptParseCompile')
                                                        totalScriptTime += task.selfTime;
                                                }
                                                // console.log(
                                                //   `Total javascript time: ${Math.round(totalScriptTime * 100) / 100}ms`
                                                // );
                                                // console.log(tasks);
                                                fs_1.fs.writeFileSync('b.json', '{}');
                                                traceEvents = parsedTrace.traceEvents;
                                                ts = 0;
                                                for (i = 0; i < traceEvents.length; i++) {
                                                    traceEvent = traceEvents[i];
                                                    if (traceEvent.name === constants_1.EVENT_NAME.NAVIGATION_START &&
                                                        traceEvent.args.data.documentLoaderURL.includes(this.url)) {
                                                        ts = traceEvent.ts;
                                                    }
                                                    else if (this.indications.includes(traceEvent.name)) {
                                                        metric = metrics[traceEvent.name];
                                                        metric.push({
                                                            name: traceEvent.name,
                                                            duration: this.getTime(traceEvent.ts, ts)
                                                        });
                                                    }
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            })];
                    case 2:
                        // await this.progress.start();
                        _a.sent();
                        for (i = 0; i < 1; i++) {
                            cluster.queue(i);
                        }
                        return [4 /*yield*/, cluster.idle()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, cluster.close()];
                    case 4:
                        _a.sent();
                        // this.progress.stop();
                        return [2 /*return*/, metrics];
                }
            });
        });
    };
    return Collector;
}());
exports["default"] = Collector;
