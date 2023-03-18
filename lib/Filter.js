"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simple_statistics_1 = require("simple-statistics");
class Filter {
    static process(array) {
        const q1 = (0, simple_statistics_1.quantile)(array, 0.25);
        const q3 = (0, simple_statistics_1.quantile)(array, 0.75);
        const iqr = q3 - q1;
        const coef = 1.5;
        const maxValue = q3 + iqr * coef;
        const minValue = q1 - iqr * coef;
        const result = [];
        let diff = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i] <= maxValue && array[i] >= minValue) {
                result[i - diff] = array[i];
            }
            else {
                diff += 1;
            }
        }
        return result;
    }
    constructor() { }
}
exports.default = Filter;
