import jwt from "jsonwebtoken";
import config from "../config/index.js";
import logger from "../utils/logger.js";

/**
 * Middleware to verify JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const verifyToken = (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    // Check if authorization header exists and has the Bearer format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Authentication failed: No token provided");
      return res.status(401).json({ error: "Token not provided or invalid" });
    }

    // Extract the token from the authorization header
    const token = authHeader.split(" ")[1];

    // Verify the token
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        logger.warn(`Authentication failed: ${err.message}`);
        return res.status(401).json({ error: "Token not provided or invalid" });
      }

      // Add the decoded user information to the request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};
