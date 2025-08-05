import swaggerJsdoc from "swagger-jsdoc";

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
  apis: ["./routes/*.ts"],
};

const specs = swaggerJsdoc(swaggerOptions);

export default specs;
