import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");

// Determine if we're in a development or test environment
const isDevelopmentOrTest = ["development", "test"].includes(
  process.env.NODE_ENV
);

// Create a Prisma client instance
const prisma = new PrismaClient({
  log: isDevelopmentOrTest ? ["query", "info", "warn", "error"] : ["error"],
});

/**
 * Initialize the database connection
 */
export const initDatabase = async () => {
  try {
    // Connect to the database
    await prisma.$connect();
    logger.info(`Connected to PostgreSQL database`);

    return prisma;
  } catch (error) {
    logger.error(`Database connection error: ${error.message}`);
    throw error;
  }
};

/**
 * Close the database connection
 */
export const closeDatabase = async () => {
  try {
    await prisma.$disconnect();
    logger.info("Database connection closed");
  } catch (error) {
    logger.error(`Error closing database connection: ${error.message}`);
  }
};

export default prisma;
