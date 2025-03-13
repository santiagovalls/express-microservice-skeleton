import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import winston from "winston";
import "winston-daily-rotate-file";
import config from "../config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.resolve(__dirname, "../../logs");
const winstonDir = path.resolve(logsDir, "winston");

// Create logs and winston directories if they don't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}
if (!fs.existsSync(winstonDir)) {
  fs.mkdirSync(winstonDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create daily rotate transport for file logging
const dailyRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, "%DATE%-app.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "7d", // Keep logs for 7 days
  level: config.logLevel,
  auditFile: path.join(winstonDir, "winston-audit.json"), // Set audit file location
});

// Create the logger - only with file transport, no console
const logger = winston.createLogger({
  level: config.logLevel,
  format: logFormat,
  defaultMeta: { service: "express-microservice" },
  transports: [dailyRotateTransport],
  exitOnError: false,
});

// Create a stream object for Morgan integration
logger.stream = {
  write: function (message) {
    // Use logger.info directly instead of dailyRotateTransport.log
    logger.info(message.trim());
    // No return value to avoid 'undefined' in logs
  },
};

export default logger;
