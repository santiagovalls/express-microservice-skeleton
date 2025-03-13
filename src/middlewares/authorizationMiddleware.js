import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const permissionsPath = path.resolve(__dirname, "../config/permissions.json");

// Load permissions configuration
let permissions;
try {
  const permissionsData = fs.readFileSync(permissionsPath, "utf8");
  permissions = JSON.parse(permissionsData);
} catch (error) {
  logger.error(`Error loading permissions configuration: ${error.message}`);
  permissions = {
    admin: [],
    user: [],
  };
}

/**
 * Middleware to check if user role has permission to access the requested endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const checkRolePermission = (req, res, next) => {
  try {
    // Get user role from the token (added by verifyToken middleware)
    const { role } = req.user;

    // Get the requested path
    const requestPath = req.path;

    // Check if the role has permission to access this path
    const allowedPaths = permissions[role] || [];

    if (allowedPaths.includes(requestPath)) {
      // User has permission, proceed to the next middleware
      logger.info(`User with role ${role} granted access to ${requestPath}`);
      next();
    } else {
      // User does not have permission
      logger.warn(
        `Access denied: User with role ${role} attempted to access ${requestPath}`
      );
      return res.status(403).json({ error: "Access denied" });
    }
  } catch (error) {
    logger.error(`Authorization error: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};
