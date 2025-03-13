import logger from "../utils/logger.js";

/**
 * Middleware for handling 404 errors (Not Found)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const notFoundHandler = (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
};

/**
 * Middleware for handling all other errors
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  // Determine status code (default to 500 if not specified)
  const statusCode = err.statusCode || 500;

  // Send error response
  res.status(statusCode).json({
    error: statusCode === 500 ? "Internal server error" : err.message,
    statusCode,
  });
};
