import express from "express";
import {
  register,
  login,
  changePassword,
} from "../controllers/auth.controller.js";

import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new traveler
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: akash
 *               email:
 *                 type: string
 *                 example: akash@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *
 *       400:
 *         description: User already exists
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: akash@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/change-password:
 *   patch:
 *     summary: Change logged-in user's password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: golu@123
 *               newPassword:
 *                 type: string
 *                 example: Waymark@2026#Demo!91
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: Password changed successfully
 *       400:
 *         description: Missing fields, weak password, same password, or incorrect current password
 *       401:
 *         description: Not authorized, token missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to change password
 */
router.patch("/change-password", protect, changePassword);

export default router;
