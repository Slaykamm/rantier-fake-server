import { logger } from "./logger";

export class SchedulerLogger {
  static jobStart(jobName: string, metadata?: any) {
    logger.scheduler("Job started", {
      jobName,
      status: "started",
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  static jobComplete(jobName: string, executionTime: number, metadata?: any) {
    logger.scheduler("Job completed", {
      jobName,
      status: "completed",
      executionTime,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  static jobError(jobName: string, error: Error, metadata?: any) {
    logger.error("Job failed", {
      jobName,
      status: "failed",
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }
}
