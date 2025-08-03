import express, { Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import sequelize from "./models/index";
import Vehicle from "./models/Vehicle";
import vehicleRoutes from "./routes/vehicles";

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

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BMW Electric Vehicle DataGrid API",
      version: "1.0.0",
      description:
        "API for managing electric vehicle data with search, filtering, and CSV upload capabilities",
      contact: {
        name: "BMW IT Internship",
        email: "internship@bmw.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Vehicle: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier for the vehicle",
            },
            brand: {
              type: "string",
              description: "Vehicle brand/manufacturer",
            },
            model: {
              type: "string",
              description: "Vehicle model name",
            },
            accelSec: {
              type: "number",
              description: "Acceleration time (0-100 km/h) in seconds",
            },
            topSpeedKm: {
              type: "integer",
              description: "Top speed in km/h",
            },
            rangeKm: {
              type: "integer",
              description: "Electric range in kilometers",
            },
            efficiencyKwh100km: {
              type: "integer",
              description: "Energy efficiency in kWh/100km",
            },
            fastChargKmh: {
              type: "integer",
              description: "Fast charging speed in km/h",
            },
            rapidChar: {
              type: "string",
              description: "Rapid charging availability (Yes/No)",
            },
            powerTrain: {
              type: "string",
              description: "Power train type (RWD/AWD/FWD)",
            },
            plugType: {
              type: "string",
              description: "Plug type (Type 2 CCS/Type 1 CHAdeMO)",
            },
            bodyStyle: {
              type: "string",
              description: "Body style (Sedan, SUV, Hatchback, etc.)",
            },
            segment: {
              type: "string",
              description: "Vehicle segment (A, B, C, D, E, F)",
            },
            seats: {
              type: "integer",
              description: "Number of seats",
            },
            priceEuro: {
              type: "integer",
              description: "Price in Euro",
            },
            date: {
              type: "string",
              description: "Listing date",
            },
          },
          required: [
            "brand",
            "model",
            "accelSec",
            "topSpeedKm",
            "rangeKm",
            "efficiencyKwh100km",
            "fastChargKmh",
            "rapidChar",
            "powerTrain",
            "plugType",
            "bodyStyle",
            "segment",
            "seats",
            "priceEuro",
            "date",
          ],
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Vehicle",
              },
            },
            total: {
              type: "integer",
              description: "Total number of vehicles",
            },
            page: {
              type: "integer",
              description: "Current page number",
            },
            totalPages: {
              type: "integer",
              description: "Total number of pages",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.ts", "./app.ts"],
};

const specs = swaggerJsdoc(swaggerOptions);

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

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

/**
 * @swagger
 * /api/v1/upload-csv:
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
  }
);

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
  console.log(
    `📚 API Documentation available at: http://localhost:${port}/api-docs`
  );
});

export default app;
