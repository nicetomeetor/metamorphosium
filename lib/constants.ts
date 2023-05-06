export const TIME = {
  EXECUTION: 'Execution time',
  WRITE_RESULT: 'Write result file time',
  WRITE_FIRST_EXPERIMENT: 'Write first experiment file time',
  WRITE_SECOND_EXPERIMENT: 'Write second experiment file time',
} as const;

export const INFO = {
  START: 'Launch the wizard',
  END: 'Complete the wizard',
  FIRST_EXPERIMENT: 'First experiment',
  SECOND_EXPERIMENT: 'Second experiment',
  PRINT_TABLE: 'Comparison result',
} as const;

export const FILE_NAME = {
  RESULT: 'result.json',
  FIRST_EXPERIMENT: 'first_sample.json',
  SECOND_EXPERIMENT: 'second_sample.json',
  LOGS: 'metamorphosium.logs',
} as const;

export const PAGE = {
  WAIT_UNTIL: 'networkidle2',
  TIMEOUT: 10000,
} as const;

export const CLUSTER = {
  TASK_ERROR: 'taskerror',
  MAX_CONCURRENCY: 1,
  RETRY_LIMIT: 10,
  TIMEOUT: 10000,
} as const;

export const COMPARE = {
  MEAN: 'Mean',
  MW: 'MW',
  P_VALUE: 'P-value',
  COUNT: 'Count',
} as const;

export const PERCENTILES = {
  P95: '95th percentile',
  P50: '50th percentile',
  P75: '75th percentile',
  P25: '25th percentile',
} as const;
