import app from "./app.js";
import { closeDatabase } from "./config/database.js";
import config from "./config/index.js";
import logger from "./utils/logger.js";

// Start the server
const PORT = config.port;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received: closing HTTP server");

  // Close the database connection
  await closeDatabase();

  server.close(() => {
    logger.info("HTTP server closed");
  });
});

export default server;
