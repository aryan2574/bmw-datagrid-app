import express, { Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import sequelize from "./models/index";
import Vehicle from "./models/Vehicle";
import vehicleRoutes from "./routes/vehicles";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: "temp/" });

// Database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully.");
    return sequelize.sync({ force: false }); // Set force: true to recreate tables
  })
  .then(() => {
    console.log("✅ Database synchronized.");
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error);
  });

// Routes
app.use("/api/v1/vehicles", vehicleRoutes);

// CSV upload endpoint
app.post(
  "/api/v1/upload-csv",
  upload.single("csv"),
  async (req: MulterRequest, res) => {
    try {
      console.log("📁 CSV upload request received");

      if (!req.file) {
        console.log("❌ No file uploaded");
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log(`📄 File uploaded: ${req.file.originalname}`);

      const results: any[] = [];
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data: any) => {
          console.log("📊 Processing row:", data);
          results.push(data);
        })
        .on("end", async () => {
          try {
            console.log(`📈 Total rows to process: ${results.length}`);

            // Clear existing data
            await Vehicle.destroy({ where: {} });
            console.log("🗑️ Cleared existing data");

            // Insert new data
            const vehicles = results.map((row) => ({
              brand: row.Brand || row.brand || "",
              model: row.Model || row.model || "",
              accelSec: parseFloat(row.AccelSec || row.accelSec || "0"),
              topSpeedKm: parseInt(row.TopSpeed_Km || row.topSpeedKm || "0"),
              rangeKm: parseInt(row.Range_Km || row.rangeKm || "0"),
              efficiencyKwh100km: parseInt(
                row["Efficiency_Kwh/100km"] || row.efficiencyKwh100km || "0"
              ),
              fastChargKmh: parseInt(
                row.FastCharg_Km_h || row.fastChargKmh || "0"
              ),
              rapidChar: row.RapidChar || row.rapidChar || "No",
              powerTrain: row.PowerTrain || row.powerTrain || "",
              plugType: row.PlugType || row.plugType || "",
              bodyStyle: row.BodyStyle || row.bodyStyle || "",
              segment: row.Segment || row.segment || "",
              seats: parseInt(row.Seats || row.seats || "5"),
              priceEuro: parseInt(row.PriceEuro || row.priceEuro || "0"),
              date: row.Date || row.date || "",
            }));

            console.log("💾 Inserting vehicles into database...");
            await Vehicle.bulkCreate(vehicles);
            console.log(`✅ Successfully inserted ${vehicles.length} vehicles`);

            // Clean up uploaded file
            if (req.file) {
              fs.unlinkSync(req.file.path);
              console.log("🗂️ Cleaned up uploaded file");
            }

            res.json({
              message: `Successfully uploaded ${vehicles.length} electric vehicles`,
              count: vehicles.length,
            });
          } catch (error) {
            console.error("❌ Error processing CSV:", error);
            res.status(500).json({ error: "Error processing CSV file" });
          }
        });
    } catch (error) {
      console.error("❌ Error uploading CSV:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Test endpoint
app.get("/api/v1/test", (req, res) => {
  res.json({
    message: "BMW Electric Vehicle DataGrid API is running",
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(
    `🚀 BMW Electric Vehicle DataGrid Server is running on port: ${port}`
  );
});

export default app;
