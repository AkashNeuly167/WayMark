import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { getPassport } from "../controllers/passport.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/passport:
 *   get:
 *     summary: Get user's travel passport
 *     tags:
 *       - Passport
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Passport statistics retrieved
 */
router.get("/", protect, getPassport);

export default router;