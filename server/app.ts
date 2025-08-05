import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import sequelize from "./models/index";
import specs from "./config/swagger";
import vehicleRoutes from "./routes/vehicles";
import uploadRoutes from "./routes/upload";
import healthRoutes from "./routes/health";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully.");
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log("✅ Database synchronized.");
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error);
  });

// Routes
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1", healthRoutes);

app.listen(port, () => {
  console.log(
    `BMW Electric Vehicle DataGrid Server is running on port: ${port}`
  );
  console.log(
    `API Documentation available at: http://localhost:${port}/api-docs`
  );
});

export default app;
