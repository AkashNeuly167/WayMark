import express from "express";
import protect from "../middlewares/auth.middleware.js";

import {
  createComment,
  getMemoryComments,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/memories/{id}/comments:
 *   post:
 *     summary: Add comment to memory
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: Amazing place!
 */
router.post("/memories/:id/comments", protect, createComment);

/**
 * @swagger
 * /api/memories/{id}/comments:
 *   get:
 *     summary: Get all comments of a memory
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get("/memories/:id/comments", getMemoryComments);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *           example: 6a215f3c15ff7edcc81f9888
 *     responses:
 *       200:
 *         description: Comment deleted successfully
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
 *                   example: Comment deleted successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
router.delete("/comments/:id", protect, deleteComment);

export default router;
