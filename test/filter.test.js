"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Filter_1 = __importDefault(require("../lib/Filter"));
test('', () => {
    const arrayToFilter = [1, 2, 3, 4, 5, 6, 8, 9, 100];
    const res = Filter_1.default.process(arrayToFilter);
    expect(res.toString()).toBe([1, 2, 3, 4, 5, 6, 8, 9].toString());
});
test('', () => {
    const arrayToFilter = [1, 2, 3, 4, 5, 6, 8, 9];
    const res = Filter_1.default.process(arrayToFilter);
    expect(res.toString()).toBe([1, 2, 3, 4, 5, 6, 8, 9].toString());
});
