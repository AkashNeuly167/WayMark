import express from "express";

import {
  searchUsers,
  searchMemories,
} from "../controllers/search.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Search APIs for users and memories
 */

/**
 * @swagger
 * /api/search/users:
 *   get:
 *     summary: Search users
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           example: akash
 *         description: Search query for username or full name
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       400:
 *         description: Search query is required
 *       500:
 *         description: Server error
 */
router.get("/users", searchUsers);

/**
 * @swagger
 * /api/search/memories:
 *   get:
 *     summary: Search memories with pagination
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           example: manali
 *         description: Search query for title, description, country, city, or location name
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Number of memories per page
 *     responses:
 *       200:
 *         description: Memories fetched successfully
 *       400:
 *         description: Search query is required
 *       500:
 *         description: Server error
 */
router.get("/memories", searchMemories);

export default router;