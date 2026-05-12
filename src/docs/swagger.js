const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const schemas = require("./swaggerSchemas");
const sponsorSponsorshipPaths = require("./swaggerPathsSponsorsSponsorships");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "OrphanCenter API",
    version: "1.0.0",
    description:
      "Initial Swagger documentation for the currently wired backend routes. Some admin endpoints are stabilized for frontend integration before all related data models are fully implemented.",
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
    { name: "Sponsors", description: "Sponsors (الكفّال) CRUD and nested sponsorships" },
    { name: "Sponsorships", description: "Sponsorships (الكفالات) CRUD and status" },
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
          "Returns the current Admin Dashboard summary response. The response data includes counts, helpRequestStatuses, totalDonations, sponsorshipRate, recent.orphans, recent.donations, and warnings. This endpoint is temporary-safe: if optional Sponsor or Donation models are not implemented yet, their values fall back to empty data and warnings explain the fallback. This route is not currently protected in the mounted Express routes.",
        responses: {
          200: {
            description:
              "Dashboard summary matching the current backend response shape, including fallback warnings when optional dashboard data sources are unavailable.",
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
    ...sponsorSponsorshipPaths,
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
