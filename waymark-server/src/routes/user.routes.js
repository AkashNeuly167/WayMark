import express from "express";
import protect from "../middlewares/auth.middleware.js";

import {
  getUserProfile,
  getMyProfile,
  updateProfile,
  toggleFollowUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// get my profile
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 */
router.get("/me", protect, getMyProfile);

// update my profile
/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Update current user profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Akash Neuly
 *               bio:
 *                 type: string
 *                 example: Travel enthusiast exploring hidden gems
 *               country:
 *                 type: string
 *                 example: India
 *               website:
 *                 type: string
 *                 example: https://waymark.app
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.patch("/me", protect, updateProfile);

// public profile
/**
 * @swagger
 * /api/users/{username}:
 *   get:
 *     summary: Get public profile
 *     tags:
 *       - Users
 */
router.get("/:id", getUserProfile);

/**
 * @swagger
 * /api/users/{id}/follow:
 *   patch:
 *     summary: Follow or unfollow a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Follow status changed
 */
router.patch("/:id/follow", protect, toggleFollowUser);

export default router;
