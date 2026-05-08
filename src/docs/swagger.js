const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const schemas = require("./swaggerSchemas");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "OrphanCenter API",
    version: "1.0.0",
    description:
      "Initial Swagger documentation for the currently wired backend routes. Admin routes are documented with Bearer auth as the expected protection, even if auth is not fully wired yet.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas,
  },
  tags: [
    { name: "System", description: "Health and API root checks" },
    { name: "Admin Dashboard", description: "Admin dashboard summary" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Check backend health",
        description: "Returns a small response confirming that the backend process is running.",
        responses: {
          200: {
            description: "Server is running",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/api": {
      get: {
        tags: ["System"],
        summary: "Check API root",
        description: "Returns basic API metadata.",
        responses: {
          200: {
            description: "API root information",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiRootResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/dashboard": {
      get: {
        tags: ["Admin Dashboard"],
        summary: "Get admin dashboard summary",
        description:
          "Returns aggregate dashboard data for the admin page. This route should be protected with Bearer JWT auth when authentication is ready.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Dashboard summary",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DashboardResponse" },
              },
            },
          },
          401: {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          403: {
            description: "Admin access required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [],
});

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = {
  setupSwagger,
  swaggerSpec,
};
