import { CollectorResult } from '../lib/types';

export const createCollectorResult = (arr: number[]): CollectorResult => {
  return {
    parseHTML: arr,
  };
};
