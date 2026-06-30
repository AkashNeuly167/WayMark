import express from "express";
import protect from "../middlewares/auth.middleware.js";

import {
  getUserProfile,
  getMyProfile,
  updateProfile,
  toggleFollowUser,
  updateAvatar,
  deleteAvatar,
  updateCoverImage,
  deleteCoverImage,
  getUserFollowers,
  getUserFollowing,
  getUserMemories,
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

/**
 * @swagger
 * /api/users/me/avatar:
 *   patch:
 *     summary: Update current user's avatar
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
 *             required:
 *               - url
 *               - publicId
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://res.cloudinary.com/demo/image/upload/v123/avatar.jpg
 *               publicId:
 *                 type: string
 *                 example: waymark/avatars/avatar_123
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *       400:
 *         description: Avatar url and publicId are required
 *       401:
 *         description: Unauthorized
 */
router.patch("/me/avatar", protect, updateAvatar);

/**
 * @swagger
 * /api/users/me/avatar:
 *   delete:
 *     summary: Delete current user's avatar
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/me/avatar", protect, deleteAvatar);

/**
 * @swagger
 * /api/users/me/cover:
 *   patch:
 *     summary: Update current user's cover image
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
 *             required:
 *               - url
 *               - publicId
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://res.cloudinary.com/demo/image/upload/v123/cover.jpg
 *               publicId:
 *                 type: string
 *                 example: waymark/covers/cover_123
 *     responses:
 *       200:
 *         description: Cover image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cover image updated successfully
 *                 user:
 *                   type: object
 *       400:
 *         description: Cover image url and publicId are required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.patch("/me/cover", protect, updateCoverImage);

/**
 * @swagger
 * /api/users/me/cover:
 *   delete:
 *     summary: Delete current user's cover image
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cover image removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cover image removed successfully
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete("/me/cover", protect, deleteCoverImage);

/**
 * @swagger
 * /api/users/{id}/followers:
 *   get:
 *     summary: Get user's followers
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Followers fetched successfully
 *       404:
 *         description: User not found
 */
router.get("/:id/followers", getUserFollowers);

/**
 * @swagger
 * /api/users/{id}/following:
 *   get:
 *     summary: Get users followed by a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Following list fetched successfully
 *       404:
 *         description: User not found
 */
router.get("/:id/following", getUserFollowing);

/**
 * @swagger
 * /api/users/{id}/memories:
 *   get:
 *     summary: Get memories created by a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User memories fetched successfully
 *       404:
 *         description: User not found
 */
router.get("/:id/memories", getUserMemories);

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
