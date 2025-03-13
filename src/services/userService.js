import bcrypt from "bcrypt";
import prisma from "../config/database.js";
import logger from "../utils/logger.js";

const SALT_ROUNDS = 10;

/**
 * Find a user by username
 * @param {string} username - The username to search for
 * @returns {Promise<Object|null>} - The user object or null if not found
 */
export const findUserByUsername = async (username) => {
  try {
    return await prisma.user.findUnique({
      where: { username },
    });
  } catch (error) {
    logger.error(`Error finding user by username: ${error.message}`);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - The user data
 * @returns {Promise<Object>} - The created user object
 */
export const createUser = async (userData) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    // Create the user with the hashed password
    return await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    throw error;
  }
};

/**
 * Update a user's last login time
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The updated user object
 */
export const updateLastLogin = async (userId) => {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data: { last_login: new Date() },
    });
  } catch (error) {
    logger.error(`Error updating last login: ${error.message}`);
    throw error;
  }
};

/**
 * Verify a user's password
 * @param {string} plainPassword - The plain text password
 * @param {string} hashedPassword - The hashed password
 * @returns {Promise<boolean>} - True if the password is valid, false otherwise
 */
export const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    logger.error(`Error verifying password: ${error.message}`);
    throw error;
  }
};

/**
 * Seed initial users (for development and testing)
 */
export const seedInitialUsers = async () => {
  try {
    // Check if users already exist
    const userCount = await prisma.user.count();

    if (userCount === 0) {
      logger.info("Seeding initial users...");

      // Create admin user
      await createUser({
        username: "admin",
        password: "1234",
        name: "Administrator",
        role: "admin",
      });

      // Create regular user
      await createUser({
        username: "user",
        password: "1234",
        name: "Regular User",
        role: "user",
      });

      logger.info("Initial users seeded successfully");
    }
  } catch (error) {
    logger.error(`Error seeding initial users: ${error.message}`);
    throw error;
  }
};
