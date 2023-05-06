import { writeFileSync, appendFileSync } from 'node:fs';

import { FILE_NAME } from './constants';

export default class Logger {
  static print(message: string): void {
    const date = new Date();
    const processed = `[${date.toISOString()}] ${message}\n`;

    appendFileSync(FILE_NAME.LOGS, processed);
  }

  static write(timeLabel: string, fileName: string, text: string): void {
    console.time(timeLabel);
    writeFileSync(fileName, text);
    console.timeEnd(timeLabel);
  }
}
