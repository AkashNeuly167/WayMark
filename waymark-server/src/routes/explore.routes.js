import express from "express";
import { getExplore } from "../controllers/explore.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/explore:
 *   get:
 *     summary: Get explore page data
 *     tags:
 *       - Explore
 *     responses:
 *       200:
 *         description: Explore data fetched successfully
 */
router.get("/", getExplore);

export default router;