"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stats_wilcoxon_1 = __importDefault(require("@stdlib/stats-wilcoxon"));
const simple_statistics_1 = require("simple-statistics");
const diff = (a, b) => a - b;
const abstract = (f, fi, s, ...params) => {
    const first = f(fi, ...params);
    const second = f(s, ...params);
    return diff(first, second);
};
class Comparator {
    static compare(first, second) {
        const res = {};
        for (const key of Object.keys(first)) {
            res[key] = {};
            const f = this.toArray(first[key]);
            const s = this.toArray(second[key]);
            const { rejected } = (0, stats_wilcoxon_1.default)(f, s);
            res[key]['status'] = rejected;
            res[key]['p25'] = abstract(simple_statistics_1.quantile, f, s, 0.25);
            res[key]['p50'] = abstract(simple_statistics_1.quantile, f, s, 0.5);
            res[key]['p75'] = abstract(simple_statistics_1.quantile, f, s, 0.75);
            res[key]['p95'] = abstract(simple_statistics_1.quantile, f, s, 0.95);
            res[key]['mean'] = abstract(simple_statistics_1.mean, f, s);
        }
        return res;
    }
    constructor() { }
    static toArray(array) {
        const newArray = [];
        for (let i = 0; i < array.length; i++) {
            newArray[i] = array[i].value;
        }
        return newArray;
    }
}
exports.default = Comparator;
