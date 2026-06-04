import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { createMemory } from "../controllers/memory.controller.js";
import { getMemories } from "../controllers/memory.controller.js";
import { getMemoryById } from "../controllers/memory.controller.js";
import { deleteMemory } from "../controllers/memory.controller.js";
import { toggleLikeMemory } from "../controllers/memory.controller.js";
import { updateMemory } from "../controllers/memory.controller.js";
import { getFeed } from "../controllers/memory.controller.js";

const router = express.Router();

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
 *
 *               description:
 *                 type: string
 *                 example: One of the best mornings I've experienced.
 *
 *               country:
 *                 type: string
 *                 example: India
 *
 *               city:
 *                 type: string
 *                 example: Manali
 *
 *               locationName:
 *                 type: string
 *                 example: Solang Valley
 *
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: 32.3167
 *
 *                   lng:
 *                     type: number
 *                     example: 77.1667
 *
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: []
 *
 *     responses:
 *       201:
 *         description: Memory created successfully
 */
router.post("/", protect, createMemory);

/**
 * @swagger
 * /api/memories:
 *   get:
 *     summary: Get all memories
 *     tags:
 *       - Memories
 *     responses:
 *       200:
 *         description: List of memories
 */
router.get("/", getMemories);

/**
 * @swagger
 * /api/memories/feed:
 *   get:
 *     summary: Get personalized feed
 *     tags:
 *       - Memories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User feed
 */
router.get("/feed", protect, getFeed);

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               locationName:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Memory updated successfully
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
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Memory not found
 */
router.delete("/:id", protect, deleteMemory);
export default router;

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
 *     responses:
 *       200:
 *         description: Memory like toggled
 *       404:
 *         description: Memory not found
 */
router.patch("/:id/like", protect, toggleLikeMemory);


