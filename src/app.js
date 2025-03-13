import cors from "cors";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Import configuration and utilities
import { initDatabase } from "./config/database.js";
import config from "./config/index.js";
import { seedInitialUsers } from "./services/userService.js";
import logger from "./utils/logger.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import mockRoutes from "./routes/mockRoutes.js";

// Import error handling middleware
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

// Create Express application
const app = express();

// Create logs directory if it doesn't exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.resolve(__dirname, "../logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configure middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Configure Morgan to use our logger stream (which writes to file only)
app.use(morgan("combined", { stream: logger.stream })); // HTTP request logging

// Register routes
app.use("/", authRoutes); // Authentication routes
app.use("/", mockRoutes); // Mock data and health check routes

// Register error handling middleware
app.use(notFoundHandler); // Handle 404 errors
app.use(errorHandler); // Handle all other errors

// Initialize the database and start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const startServer = async () => {
    try {
      // Initialize the database
      await initDatabase();

      // Seed initial users in development and test environments
      if (["development", "test"].includes(config.nodeEnv)) {
        await seedInitialUsers();
      }

      // Start the server
      const PORT = config.port;
      app.listen(PORT, () => {
        logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
      });
    } catch (error) {
      logger.error(`Failed to start server: ${error.message}`);
      process.exit(1);
    }
  };

  startServer();
}

// Export the app for testing
export default app;
