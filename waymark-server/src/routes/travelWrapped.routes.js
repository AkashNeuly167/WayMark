import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { getTravelWrapped } from "../controllers/travelWrapped.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/travel-wrapped:
 *   get:
 *     summary: Get user's yearly travel wrapped
 *     tags:
 *       - Travel Wrapped
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: number
 *           example: 2026
 *     responses:
 *       200:
 *         description: Travel wrapped generated successfully
 */
router.get("/", protect, getTravelWrapped);

export default router;