import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/v1/test:
 *   get:
 *     summary: Test API connectivity
 *     description: Simple endpoint to test if the API is running
 *     tags: [Health Check]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "BMW Electric Vehicle DataGrid API is running"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 */
router.get("/test", (req, res) => {
  res.json({
    message: "BMW Electric Vehicle DataGrid API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
