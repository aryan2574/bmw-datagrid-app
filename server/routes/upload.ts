import express, { Request } from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import Vehicle from "../models/Vehicle";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Safe parsing functions
const safeParseInt = (value: string, defaultValue: number): number => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

const safeParseFloat = (value: string, defaultValue: number): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Configure multer for file uploads
const upload = multer({ dest: "temp/" });

const router = express.Router();

/**
 * @swagger
 * /api/v1/upload/csv:
 *   post:
 *     summary: Upload and process CSV file
 *     description: Upload a CSV file containing electric vehicle data. The file will be processed and vehicles will be imported into the database.
 *     tags: [CSV Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               csv:
 *                 type: string
 *                 format: binary
 *                 description: CSV file containing vehicle data
 *     responses:
 *       200:
 *         description: CSV file processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully uploaded 15 electric vehicles"
 *                 count:
 *                   type: integer
 *                   example: 15
 *       400:
 *         description: No file uploaded or invalid CSV format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/csv", upload.single("csv"), async (req: MulterRequest, res) => {
  try {
    console.log("📁 CSV upload request received");

    if (!req.file) {
      console.log("❌ No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`📄 File uploaded: ${req.file.originalname}`);

    const results: any[] = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: any) => {
        console.log("📊 Processing row:", data);
        results.push(data);
      })
      .on("error", (error) => {
        console.error("❌ CSV parsing error:", error);
        // Clean up file on parsing error
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        res.status(400).json({ error: "Invalid CSV format" });
      })
      .on("end", async () => {
        try {
          console.log(`📈 Total rows to process: ${results.length}`);

          // Clear existing data
          await Vehicle.destroy({ where: {} });
          console.log("🗑️ Cleared existing data");

          // Insert new data with safe parsing
          const vehicles = results.map((row) => ({
            brand: row.Brand || row.brand || "",
            model: row.Model || row.model || "",
            accelSec: safeParseFloat(row.AccelSec || row.accelSec || "0", 0),
            topSpeedKm: safeParseInt(
              row.TopSpeed_Km || row.topSpeedKm || "0",
              0
            ),
            rangeKm: safeParseInt(row.Range_Km || row.rangeKm || "0", 0),
            efficiencyKwh100km: safeParseInt(
              row["Efficiency_Kwh/100km"] || row.efficiencyKwh100km || "0",
              0
            ),
            fastChargKmh: safeParseInt(
              row.FastCharg_Km_h || row.fastChargKmh || "0",
              0
            ),
            rapidChar: row.RapidChar || row.rapidChar || "No",
            powerTrain: row.PowerTrain || row.powerTrain || "",
            plugType: row.PlugType || row.plugType || "",
            bodyStyle: row.BodyStyle || row.bodyStyle || "",
            segment: row.Segment || row.segment || "",
            seats: safeParseInt(row.Seats || row.seats || "5", 5),
            priceEuro: safeParseInt(row.PriceEuro || row.priceEuro || "0", 0),
            date: row.Date || row.date || "",
          }));

          console.log("💾 Inserting vehicles into database...");
          await Vehicle.bulkCreate(vehicles);
          console.log(`✅ Successfully inserted ${vehicles.length} vehicles`);

          // Clean up uploaded file
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("🗂️ Cleaned up uploaded file");
          }

          res.json({
            message: `Successfully uploaded ${vehicles.length} electric vehicles`,
            count: vehicles.length,
          });
        } catch (error) {
          console.error("❌ Error processing CSV:", error);
          // Clean up file on processing error
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          res.status(500).json({ error: "Error processing CSV file" });
        }
      });
  } catch (error) {
    console.error("❌ Error uploading CSV:", error);
    // Clean up file on upload error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
