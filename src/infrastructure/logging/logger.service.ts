import { Injectable, LoggerService as NestLoggerService } from "@nestjs/common";

@Injectable()
export class LoggerService implements NestLoggerService {
  log(message: string, context?: any) {
    console.log(
      JSON.stringify({
        level: "info",
        message,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  error(message: string, trace?: string, context?: any) {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        trace,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  warn(message: string, context?: any) {
    console.warn(
      JSON.stringify({
        level: "warn",
        message,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  debug(message: string, context?: any) {
    console.debug(
      JSON.stringify({
        level: "debug",
        message,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  verbose(message: string, context?: any) {
    console.log(
      JSON.stringify({
        level: "verbose",
        message,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}
