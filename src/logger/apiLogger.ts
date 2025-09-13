import { logger } from "./logger";
import { Request, Response, NextFunction } from "express";

export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const userId =
      // @ts-ignore
      req.user?.uid ??
      (req.headers["x-user-id"] as string | undefined) ??
      (req.body && (req.body.userId as string | undefined));

    logger.info("[API] request", {
      category: "api",
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      userId: userId || null,
      body: req.body || null,
      query: req.query || null,
    });
  });

  next();
};
