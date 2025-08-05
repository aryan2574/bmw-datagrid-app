import express from "express";
import { Op } from "sequelize";
import Vehicle from "../models/Vehicle";

const router = express.Router();

/**
 * @swagger
 * /api/v1/vehicles:
 *   get:
 *     summary: Get all vehicles with search and filtering
 *     description: Retrieve a paginated list of electric vehicles with optional search and filtering capabilities
 *     tags: [Vehicles]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter vehicles by brand, model, body style, segment, power train, plug type, or rapid charge
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of vehicles per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: id
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: Sort order (ASC or DESC)
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: JSON string containing filter criteria with operator and value
 *     responses:
 *       200:
 *         description: List of vehicles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
      try {
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
      } catch (error) {
        console.error("Invalid filter JSON:", error);
        return res.status(400).json({ error: "Invalid filter format" });
      }
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

/**
 * @swagger
 * /api/v1/vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     description: Retrieve a specific vehicle by its unique identifier
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
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

/**
 * @swagger
 * /api/v1/vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     description: Create a new electric vehicle record in the database
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Invalid data provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(400).json({ error: "Invalid data provided" });
  }
});

/**
 * @swagger
 * /api/v1/vehicles/{id}:
 *   put:
 *     summary: Update vehicle by ID
 *     description: Update an existing vehicle record by its unique identifier
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid data provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/v1/vehicles/{id}:
 *   delete:
 *     summary: Delete vehicle by ID
 *     description: Delete a vehicle record by its unique identifier
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vehicle deleted successfully"
 *       404:
 *         description: Vehicle not found
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
