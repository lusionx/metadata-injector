import * as util from "util";

export interface ILogger {
  log(str: string): void;
  format(key: string, lvl: LogLevel, ss: string): string;
}

export enum LogLevel {
  trace = 40,
  debug = 30,
  info = 20,
  warn = 10,
  error = 0,
}

export class Logger implements ILogger {
  public level: LogLevel;
  constructor() {
    this.level = LogLevel.info;
  }
  log(str: string): void {
    console.log(str);
  }

  format(key: string, lvl: LogLevel, ss: string) {
    const now = new Date().toISOString();
    const str = `[${now}] [${LogLevel[lvl].toUpperCase()}] [${key}] - `;
    let color = str;
    switch (lvl) {
      case LogLevel.trace: // B
        color = `\x1B[34;1m${str}\x1B[0m`;
        break;
      case LogLevel.debug: // P
        color = `\x1B[35;1m${str}\x1B[0m`;
        break;
      case LogLevel.info: // G
        color = `\x1B[32;1m${str}\x1B[0m`;
        break;
      case LogLevel.warn: // Y
        color = `\x1B[33;1m${str}\x1B[0m`;
        break;
      case LogLevel.error: // R
        color = `\x1B[31;1m${str}\x1B[0m`;
        break;
      default:
        break;
    }
    return color + ss;
  }

  trace(key: string, ...args: any[]) {
    const lv = LogLevel.trace;
    if (this.level >= lv) {
      this.log(this.format(key, lv, util.format(...args)));
    }
  }
  debug(key: string, ...args: any[]) {
    const lv = LogLevel.debug;
    if (this.level >= lv) {
      this.log(this.format(key, lv, util.format(...args)));
    }
  }
  info(key: string, ...args: any[]) {
    const lv = LogLevel.info;
    if (this.level >= lv) {
      this.log(this.format(key, lv, util.format(...args)));
    }
  }
  warn(key: string, ...args: any[]) {
    const lv = LogLevel.warn;
    if (this.level >= lv) {
      this.log(this.format(key, lv, util.format(...args)));
    }
  }
  error(key: string, ...args: any[]) {
    const lv = LogLevel.error;
    if (this.level >= lv) {
      this.log(this.format(key, lv, util.format(...args)));
    }
  }
}
