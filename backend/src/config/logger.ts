import chalk from "chalk";

class Logger {
  private format(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  info(message: string, ...meta: any[]): void {
    console.log(chalk.blue(this.format("INFO", message)), ...meta);
  }

  warn(message: string, ...meta: any[]): void {
    console.log(chalk.yellow(this.format("WARN", message)), ...meta);
  }

  error(message: string, ...meta: any[]): void {
    console.log(chalk.red(this.format("ERROR", message)), ...meta);
  }
}

export const logger = new Logger();