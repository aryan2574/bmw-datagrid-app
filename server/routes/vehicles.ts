import express from "express";
import { Op } from "sequelize";
import Vehicle from "../models/Vehicle";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      sortBy = "id",
      sortOrder = "ASC",
      filter,
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: any = {};

    if (search) {
      whereClause[Op.or] = [
        { brand: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } },
        { bodyStyle: { [Op.like]: `%${search}%` } },
        { segment: { [Op.like]: `%${search}%` } },
        { powerTrain: { [Op.like]: `%${search}%` } },
        { plugType: { [Op.like]: `%${search}%` } },
        { rapidChar: { [Op.like]: `%${search}%` } },
      ];
    }

    if (filter) {
      const filterObj = JSON.parse(filter as string);
      Object.keys(filterObj).forEach((key) => {
        const filterValue = filterObj[key];
        if (
          filterValue &&
          filterValue.value !== undefined &&
          filterValue.value !== ""
        ) {
          switch (filterValue.operator) {
            case "contains":
              whereClause[key] = { [Op.like]: `%${filterValue.value}%` };
              break;
            case "equals":
              whereClause[key] = filterValue.value;
              break;
            case "startsWith":
              whereClause[key] = { [Op.like]: `${filterValue.value}%` };
              break;
            case "endsWith":
              whereClause[key] = { [Op.like]: `%${filterValue.value}` };
              break;
            case "isEmpty":
              whereClause[key] = {
                [Op.or]: [{ [Op.is]: null }, { [Op.eq]: "" }],
              };
              break;
            case "greaterThan":
              whereClause[key] = { [Op.gt]: filterValue.value };
              break;
            case "lessThan":
              whereClause[key] = { [Op.lt]: filterValue.value };
              break;
            default:
              whereClause[key] = { [Op.like]: `%${filterValue.value}%` };
          }
        }
      });
    }

    const { count, rows } = await Vehicle.findAndCountAll({
      where: whereClause,
      order: [[sortBy as string, sortOrder as string]],
      limit: Number(limit),
      offset,
    });

    res.json({
      data: rows,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(400).json({ error: "Invalid data provided" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    await vehicle.update(req.body);
    res.json(vehicle);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(400).json({ error: "Invalid data provided" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    await vehicle.destroy();
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
