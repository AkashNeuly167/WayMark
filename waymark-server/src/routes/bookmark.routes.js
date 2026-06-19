import express from "express";
import protect from "../middlewares/auth.middleware.js";

import {
  getSavedMemories,
  getSavedMemoryIds,
  saveMemory,
  unsaveMemory,
} from "../controllers/bookmark.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Get current user's saved memories
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saved memories fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getSavedMemories);

/**
 * @swagger
 * /api/bookmarks/ids:
 *   get:
 *     summary: Get current user's saved memory ids
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saved memory ids fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/ids", protect, getSavedMemoryIds);

/**
 * @swagger
 * /api/bookmarks/{memoryId}:
 *   post:
 *     summary: Save a memory
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Memory id
 *     responses:
 *       201:
 *         description: Memory saved successfully
 *       200:
 *         description: Memory already saved
 *       404:
 *         description: Memory not found
 *       401:
 *         description: Unauthorized
 */
router.post("/:memoryId", protect, saveMemory);

/**
 * @swagger
 * /api/bookmarks/{memoryId}:
 *   delete:
 *     summary: Remove a memory from saved list
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Memory id
 *     responses:
 *       200:
 *         description: Memory removed from saved list
 *       404:
 *         description: Bookmark not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:memoryId", protect, unsaveMemory);

export default router;