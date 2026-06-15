import express from "express";
import protect from "../middlewares/auth.middleware.js";

import {
  createMemory,
  getMemories,
  getMemoryById,
  deleteMemory,
  toggleLikeMemory,
  updateMemory,
  getFeed,
} from "../controllers/memory.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Memories
 *   description: Memory management APIs
 */

/**
 * @swagger
 * /api/memories:
 *   post:
 *     summary: Create a travel memory
 *     tags:
 *       - Memories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - country
 *               - city
 *               - locationName
 *             properties:
 *               title:
 *                 type: string
 *                 example: Sunrise at Manali
 *               description:
 *                 type: string
 *                 example: One of the best mornings I've experienced.
 *               country:
 *                 type: string
 *                 example: India
 *               city:
 *                 type: string
 *                 example: Manali
 *               locationName:
 *                 type: string
 *                 example: Solang Valley
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: 32.3167
 *                   lng:
 *                     type: number
 *                     example: 77.1667
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/sample.jpg
 *                     publicId:
 *                       type: string
 *                       example: waymark/memories/sample123
 *     responses:
 *       201:
 *         description: Memory created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post("/", protect, createMemory);

/**
 * @swagger
 * /api/memories:
 *   get:
 *     summary: Get all memories with pagination
 *     tags:
 *       - Memories
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of memories per page
 *     responses:
 *       200:
 *         description: List of memories fetched successfully
 *       500:
 *         description: Server error
 */
router.get("/", getMemories);

/**
 * @swagger
 * /api/memories/feed:
 *   get:
 *     summary: Get personalized feed from followed users
 *     tags:
 *       - Memories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of memories per page
 *     responses:
 *       200:
 *         description: Personalized feed fetched successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/feed", protect, getFeed);

/**
 * @swagger
 * /api/memories/{id}/like:
 *   patch:
 *     summary: Like or unlike a memory
 *     tags:
 *       - Memories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Memory ID
 *         schema:
 *           type: string
 *           example: 6a214bc615ff7edcc81f9878
 *     responses:
 *       200:
 *         description: Memory like toggled successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Memory not found
 *       500:
 *         description: Server error
 */
router.patch("/:id/like", protect, toggleLikeMemory);

/**
 * @swagger
 * /api/memories/{id}:
 *   get:
 *     summary: Get a memory by ID
 *     tags:
 *       - Memories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Memory ID
 *         schema:
 *           type: string
 *           example: 6a214bc615ff7edcc81f9878
 *     responses:
 *       200:
 *         description: Memory fetched successfully
 *       404:
 *         description: Memory not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getMemoryById);

/**
 * @swagger
 * /api/memories/{id}:
 *   patch:
 *     summary: Update a memory
 *     tags:
 *       - Memories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Memory ID
 *         schema:
 *           type: string
 *           example: 6a214bc615ff7edcc81f9878
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Evening in Rishikesh
 *               description:
 *                 type: string
 *                 example: Peaceful evening near the Ganga.
 *               country:
 *                 type: string
 *                 example: India
 *               city:
 *                 type: string
 *                 example: Rishikesh
 *               locationName:
 *                 type: string
 *                 example: Laxman Jhula
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: 30.0869
 *                   lng:
 *                     type: number
 *                     example: 78.2676
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/sample.jpg
 *                     publicId:
 *                       type: string
 *                       example: waymark/memories/sample123
 *     responses:
 *       200:
 *         description: Memory updated successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Memory not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", protect, updateMemory);

/**
 * @swagger
 * /api/memories/{id}:
 *   delete:
 *     summary: Delete a memory
 *     tags:
 *       - Memories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Memory ID
 *         schema:
 *           type: string
 *           example: 6a214bc615ff7edcc81f9878
 *     responses:
 *       200:
 *         description: Memory deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Memory not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteMemory);

export default router;