import jwt from "jsonwebtoken";
import config from "../config/index.js";
import logger from "../utils/logger.js";

// Users with their credentials and UUIDs
const USERS = [
  {
    username: "admin",
    password: "1234",
    uuid: "550e8400-e29b-41d4-a716-446655440000",
    role: "admin",
  },
  {
    username: "user",
    password: "1234",
    uuid: "550e8400-e29b-41d4-a716-446655440001",
    role: "user",
  },
];

/**
 * Controller for user login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const login = (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate that username and password are provided
    if (!username || !password) {
      logger.warn("Login attempt failed: Missing credentials");
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find user by username and password
    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );

    // Validate credentials
    if (!user) {
      logger.warn(`Login attempt failed for user: ${username}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token with user information
    const token = jwt.sign(
      {
        username: user.username,
        uuid: user.uuid,
        role: user.role,
      },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiration,
      }
    );

    // Log successful login
    logger.info(`User ${username} logged in successfully`);

    // Return token
    return res.status(200).json({ token });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};
