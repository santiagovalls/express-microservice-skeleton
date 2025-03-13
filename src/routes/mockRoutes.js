import { Router } from "express";
import {
  getAdminMockData,
  getMockData,
  getUserMockData,
  healthCheck,
} from "../controllers/mockController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkRolePermission } from "../middlewares/authorizationMiddleware.js";

const router = Router();

/**
 * @route GET /mock
 * @desc Get mock data from JSON file
 * @access Private (requires authentication)
 */
router.get("/mock", verifyToken, checkRolePermission, getMockData);

/**
 * @route GET /admin-mock
 * @desc Get admin-specific mock data
 * @access Private (requires admin role)
 */
router.get("/admin-mock", verifyToken, checkRolePermission, getAdminMockData);

/**
 * @route GET /user-mock
 * @desc Get user-specific mock data
 * @access Private (requires user role)
 */
router.get("/user-mock", verifyToken, checkRolePermission, getUserMockData);

/**
 * @route GET /health-check
 * @desc Check if the service is running
 * @access Public
 */
router.get("/health-check", healthCheck);

export default router;
