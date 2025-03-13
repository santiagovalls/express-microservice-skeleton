import jwt from "jsonwebtoken";
import config from "../config/index.js";
import {
  findUserByUsername,
  updateLastLogin,
  verifyPassword,
} from "../services/userService.js";
import logger from "../utils/logger.js";

/**
 * Controller for user login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate that username and password are provided
    if (!username || !password) {
      logger.warn("Login attempt failed: Missing credentials");
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find user by username
    const user = await findUserByUsername(username);

    // Validate user exists
    if (!user) {
      logger.warn(`Login attempt failed for user: ${username}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Validate password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      logger.warn(
        `Login attempt failed for user: ${username} (invalid password)`
      );
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Update last login time
    await updateLastLogin(user.id);

    // Generate JWT token with user information
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiration,
      }
    );

    // Log successful login
    logger.info(`User ${username} logged in successfully`);

    // Return token and user information
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};
