import express from "express";
import protect from "../middlewares/auth.middleware.js";

import {
  createBucketItem,
  getBucketList,
  updateBucketItem,
  deleteBucketItem,
} from "../controllers/bucketList.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/bucket-list:
 *   post:
 *     summary: Add destination to bucket list
 *     tags:
 *       - Bucket List
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
 *               - country
 *               - city
 *               - locationName
 *             properties:
 *               title:
 *                 type: string
 *                 example: Visit Santorini
 *               country:
 *                 type: string
 *                 example: Greece
 *               city:
 *                 type: string
 *                 example: Santorini
 *               locationName:
 *                 type: string
 *                 example: Oia Village
 *               notes:
 *                 type: string
 *                 example: Famous sunset destination
 */
router.post(
  "/",
  protect,
  createBucketItem
);

/**
 * @swagger
 * /api/bucket-list:
 *   get:
 *     summary: Get current user's bucket list
 *     tags:
 *       - Bucket List
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bucket list fetched successfully
 */
router.get(
  "/",
  protect,
  getBucketList
);

/**
 * @swagger
 * /api/bucket-list/{id}:
 *   patch:
 *     summary: Update bucket list item
 *     tags:
 *       - Bucket List
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Bucket item ID
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
 *                 example: Visit Santorini
 *               country:
 *                 type: string
 *                 example: Greece
 *               city:
 *                 type: string
 *                 example: Santorini
 *               locationName:
 *                 type: string
 *                 example: Oia Village
 *               notes:
 *                 type: string
 *                 example: Updated notes
 *               status:
 *                 type: string
 *                 enum: [want_to_visit, planning, visited]
 *                 example: planning
 *     responses:
 *       200:
 *         description: Bucket item updated successfully
 *       404:
 *         description: Item not found
 */
router.patch(
  "/:id",
  protect,
  updateBucketItem
);

/**
 * @swagger
 * /api/bucket-list/{id}:
 *   delete:
 *     summary: Delete bucket list item
 *     tags:
 *       - Bucket List
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Bucket item ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bucket item deleted successfully
 *       404:
 *         description: Item not found
 */
router.delete(
  "/:id",
  protect,
  deleteBucketItem
);

export default router;