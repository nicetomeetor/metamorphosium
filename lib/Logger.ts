import fs from 'node:fs';

import { FILE_NAME } from './constants';

export default class Logger {
  static print(message: string) {
    const date = new Date();
    const processed = `[${date.toISOString()}] ${message}\n`;

    fs.appendFileSync(FILE_NAME.LOGS, processed);
  }
}
