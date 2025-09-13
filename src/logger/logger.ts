import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Определяем интерфейс для кастомных уровней
interface CustomLevels extends winston.Logger {
  db: winston.LeveledLogMethod;
  scheduler: winston.LeveledLogMethod;
}

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    db: 5,
    scheduler: 6,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
    db: "blue",
    scheduler: "cyan",
  },
};

winston.addColors(customLevels.colors);

const baseJsonFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Человекочитаемый формат: TS [level] message key=value key2=value2
const readableLineFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const parts: string[] = [];
    Object.entries(meta).forEach(([key, value]) => {
      if (value === undefined) return;
      const serialized =
        typeof value === "string"
          ? JSON.stringify(value)
          : JSON.stringify(value);
      parts.push(`${key}=${serialized}`);
    });
    if (stack) {
      parts.push(`stack=${JSON.stringify(stack)}`);
    }
    const tail = parts.length ? ` ${parts.join(" ")}` : "";
    return `${timestamp} [${level}] ${message}${tail}`;
  })
);

// Фильтр по категории (meta.category)
const filterByCategory = (category: string) =>
  winston.format((info) => (info.category === category ? info : false))();

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const color = (text: string, code: string) =>
          `\x1b[${code}m${text}\x1b[0m`;
        const colorStatus = (status?: unknown) => {
          const s = typeof status === "number" ? status : Number(status);
          if (!Number.isFinite(s)) return String(status ?? "");
          if (s >= 200 && s < 300) return color(String(s), "32"); // green
          if (s >= 300 && s < 400) return color(String(s), "36"); // cyan
          if (s >= 400 && s < 500) return color(String(s), "31"); // red
          if (s >= 500) return color(String(s), "35"); // magenta
          return String(s);
        };

        const kv: string[] = [];
        Object.entries(meta).forEach(([key, value]) => {
          if (value === undefined) return;
          // Особая раскраска для status
          if (key === "status") {
            kv.push(`${key}=${colorStatus(value)}`);
            return;
          }
          const serialized =
            typeof value === "string"
              ? JSON.stringify(value)
              : JSON.stringify(value);
          kv.push(`${key}=${serialized}`);
        });
        const tail = kv.length ? ` ${kv.join(" ")}` : "";
        return `${timestamp} [${level}] ${message}${tail}`;
      })
    ),
  }),

  // Общий лог
  new DailyRotateFile({
    filename: "logs/%DATE%/%DATE%_application.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: readableLineFormat,
  }),

  // Ошибки
  new DailyRotateFile({
    filename: "logs/%DATE%/%DATE%_error.log",
    datePattern: "YYYY-MM-DD",
    level: "error",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
    format: readableLineFormat,
  }),

  // API категории
  new DailyRotateFile({
    filename: "logs/%DATE%/%DATE%_api.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: winston.format.combine(filterByCategory("api"), readableLineFormat),
  }),

  // Scheduler категории
  new DailyRotateFile({
    filename: "logs/%DATE%/%DATE%_scheduler.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: winston.format.combine(
      filterByCategory("scheduler"),
      readableLineFormat
    ),
  }),

  // Push категории
  new DailyRotateFile({
    filename: "logs/%DATE%/%DATE%_push.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: winston.format.combine(
      filterByCategory("push"),
      readableLineFormat
    ),
  }),

  // User devices категории
  new DailyRotateFile({
    filename: "logs/%DATE%/%DATE%_user_devices.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: winston.format.combine(
      filterByCategory("user_devices"),
      readableLineFormat
    ),
  }),
];

// Создаем логгер с кастомными уровнями
const logger = winston.createLogger({
  level: "info",
  levels: customLevels.levels,
  format: baseJsonFormat,
  transports,
  defaultMeta: { service: "rantier_service" },
}) as unknown as CustomLevels;

export { logger };
