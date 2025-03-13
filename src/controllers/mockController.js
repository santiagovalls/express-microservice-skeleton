import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");

/**
 * Controller to get mock data from JSON file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getMockData = async (req, res) => {
  try {
    // Read the mock-response.json file
    const mockFilePath = path.join(rootDir, "mock-response.json");
    const mockData = await fs.readFile(mockFilePath, "utf8");

    // Parse the JSON data
    const data = JSON.parse(mockData);

    // Add user information from the token
    const userInfo = {
      username: req.user.username,
      uuid: req.user.uuid,
      role: req.user.role,
    };

    // Log the successful request
    logger.info(
      `Mock data retrieved successfully by user: ${userInfo.username}`
    );

    // Return the mock data with user information
    return res.status(200).json({
      ...data,
      user: userInfo,
    });
  } catch (error) {
    logger.error(`Error retrieving mock data: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Controller to get admin-specific mock data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAdminMockData = async (req, res) => {
  try {
    // Read the mock-response.json file
    const mockFilePath = path.join(rootDir, "mock-response.json");
    const mockData = await fs.readFile(mockFilePath, "utf8");

    // Parse the JSON data
    const data = JSON.parse(mockData);

    // Add user information from the token
    const userInfo = {
      username: req.user.username,
      uuid: req.user.uuid,
      role: req.user.role,
    };

    // Log the successful request
    logger.info(
      `Admin mock data retrieved successfully by admin: ${userInfo.username}`
    );

    // Return the mock data with user information and admin-specific data
    return res.status(200).json({
      ...data,
      user: userInfo,
      adminData: {
        isAdmin: true,
        adminAccess: "full",
        adminTimestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error(`Error retrieving admin mock data: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Controller to get user-specific mock data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserMockData = async (req, res) => {
  try {
    // Read the mock-response.json file
    const mockFilePath = path.join(rootDir, "mock-response.json");
    const mockData = await fs.readFile(mockFilePath, "utf8");

    // Parse the JSON data
    const data = JSON.parse(mockData);

    // Add user information from the token
    const userInfo = {
      username: req.user.username,
      uuid: req.user.uuid,
      role: req.user.role,
    };

    // Log the successful request
    logger.info(
      `User mock data retrieved successfully by user: ${userInfo.username}`
    );

    // Return the mock data with user information and user-specific data
    return res.status(200).json({
      ...data,
      user: userInfo,
      userData: {
        accessLevel: "standard",
        userTimestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error(`Error retrieving user mock data: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Controller for health check endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const healthCheck = (req, res) => {
  try {
    // Create response with current timestamp
    const response = {
      status: "ok",
      timestamp: new Date().toISOString(),
    };

    // Log the health check request
    logger.debug("Health check performed");

    // Return the health status
    return res.status(200).json(response);
  } catch (error) {
    logger.error(`Health check error: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};
