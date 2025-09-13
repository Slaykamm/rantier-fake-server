import { logger } from "./logger";
import { QueryRunner } from "typeorm";

export class DBLogger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.db("DB Query", {
      query,
      parameters,
      type: "query",
    });
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    logger.error("DB Query Error", {
      error,
      query,
      parameters,
      type: "query_error",
    });
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    logger.warn("Slow DB Query", {
      executionTime: time,
      query,
      parameters,
      type: "slow_query",
    });
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    logger.db("DB Schema", {
      message,
      type: "schema",
    });
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    logger.db("DB Migration", {
      message,
      type: "migration",
    });
  }
}
