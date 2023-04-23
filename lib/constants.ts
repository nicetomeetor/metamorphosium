export const TIME = {
  EXECUTION: 'Execution time',
  WRITE_RESULT: 'Write file time',
  WRITE_FIRST_SELECTION: 'Write first selection time',
  WRITE_SECOND_SELECTION: 'Write second selection time',
} as const;

export const INFO = {
  START: 'Launch the wizard',
  END: 'Complete the wizard',
  FIRST_SELECTION: 'First selection',
  SECOND_SELECTION: 'Second selection',
  PRINT_TABLE: 'Result',
} as const;

export const EVENT_NAME = {
  NAVIGATION_START: 'navigationStart',
} as const;

export const FILE_NAME = {
  RESULT: 'result.json',
  FIRST_SELECTION: 'first_selection.json',
  SECOND_SELECTION: 'second_selection.json',
};
