import { writeFileSync, appendFileSync } from 'node:fs';

export default class Logger {
  static print(fileName: string, message: string): void {
    const date = new Date();
    const processed = `[${date.toISOString()}] ${message}\n`;

    appendFileSync(fileName, processed);
  }

  static write(timeLabel: string, fileName: string, message: string): void {
    console.time(timeLabel);
    writeFileSync(fileName, message);
    console.timeEnd(timeLabel);
  }
}
