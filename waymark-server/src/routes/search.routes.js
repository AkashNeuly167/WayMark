import express from "express";

import {
  searchUsers,
  searchMemories,
} from "../controllers/search.controller.js";

const router = express.Router();

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
 *     responses:
 *       200:
 *         description: Users found
 */
router.get(
  "/users",
  searchUsers
);

/**
 * @swagger
 * /api/search/memories:
 *   get:
 *     summary: Search memories
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Memories found
 */
router.get(
  "/memories",
  searchMemories
);

export default router;