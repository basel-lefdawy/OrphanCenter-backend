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
    { name: "Auth", description: "Facebook OAuth and JWT auth routes" },
    { name: "Admin Dashboard", description: "Admin dashboard summary" },
    { name: "Help Requests", description: "Public help request submission and lookup" },
    { name: "Admin Help Requests", description: "Admin help request review workflow" },
    { name: "Admin Donations", description: "Admin donation review workflow" },
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
    "/api/auth/facebook": {
      get: {
        tags: ["Auth"],
        summary: "Start Facebook login",
        description:
          "Starts the backend-driven Facebook OAuth flow. This route redirects the user's browser to Facebook for authentication and email permission consent.",
        responses: {
          302: {
            description: "Redirects to Facebook OAuth authentication.",
          },
          500: {
            description: "Server error or Facebook OAuth configuration error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/auth/facebook/callback": {
      get: {
        tags: ["Auth"],
        summary: "Facebook OAuth callback",
        description:
          "Callback URL used by Facebook after authentication. On success, the backend signs a JWT and redirects the browser to the frontend Facebook success route with the token in the query string.",
        responses: {
          302: {
            description:
              "Redirects to the frontend success URL, for example /auth/facebook/success?token=<jwt>.",
          },
          401: {
            description: "Facebook authentication failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          500: {
            description: "Server error during Facebook OAuth callback handling.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current authenticated user",
        description:
          "Returns the current user decoded from the JWT. Requires an Authorization header in the format: Bearer <token>.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Current authenticated user.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CurrentUserResponse" },
              },
            },
          },
          401: {
            description: "Missing, invalid, or expired JWT.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          500: {
            description: "Server error while resolving current user.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
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
          "Returns the current Admin Dashboard summary response. The response data includes counts, helpRequestStatuses, totalDonations, sponsorshipRate, recent.orphans, recent.donations, and warnings. This endpoint is temporary-safe: if a dashboard data source cannot be queried, its values fall back to empty data and warnings explain the fallback. This route is protected by JWT authentication and admin authorization.",
        security: [{ bearerAuth: [] }],
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
    "/api/help-requests": {
      get: {
        tags: ["Help Requests"],
        summary: "List help requests",
        description: "Returns all help requests using the currently mounted public route.",
        responses: {
          200: {
            description: "List of help requests.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HelpRequestSuccessList" },
              },
            },
          },
          500: {
            description: "Server error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Help Requests"],
        summary: "Create help request",
        description:
          "Submits a public help request. IBAN and bankAccount are required when paymentMethod is BankAccount.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HelpRequestCreateBody" },
            },
          },
        },
        responses: {
          201: {
            description: "Help request created.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HelpRequestSuccessOne" },
              },
            },
          },
          400: {
            description: "Validation error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          500: {
            description: "Server error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/help-requests/{id}": {
      get: {
        tags: ["Help Requests"],
        summary: "Get help request by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Help request found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HelpRequest" },
              },
            },
          },
          404: {
            description: "Help request not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          500: {
            description: "Server error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/admin/help-requests": {
      get: {
        tags: ["Admin Help Requests"],
        summary: "List admin help requests",
        description: "Returns all help requests for admin review.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of help requests.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HelpRequestSuccessList" },
              },
            },
          },
          500: {
            description: "Server error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/admin/help-requests/pending": {
      get: {
        tags: ["Admin Help Requests"],
        summary: "List pending help requests",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of pending help requests.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HelpRequestSuccessList" },
              },
            },
          },
          500: {
            description: "Server error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/admin/help-requests/{id}": {
      get: {
        tags: ["Admin Help Requests"],
        summary: "Get admin help request by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Help request found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HelpRequest" },
              },
            },
          },
          404: {
            description: "Help request not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          500: {
            description: "Server error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Admin Help Requests"],
        summary: "Update help request",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HelpRequestUpdateBody" },
            },
          },
        },
        responses: {
          200: {
            description: "Help request updated.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HelpRequest" },
              },
            },
          },
          404: {
            description: "Help request not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          500: {
            description: "Server error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Admin Help Requests"],
        summary: "Delete help request",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Help request deleted.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HelpRequestDeleteResponse" },
              },
            },
          },
          404: {
            description: "Help request not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          500: {
            description: "Server error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/admin/help-requests/{id}/approve": {
      patch: {
        tags: ["Admin Help Requests"],
        summary: "Approve help request",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Help request approved.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HelpRequestSuccessOne" },
              },
            },
          },
          500: {
            description: "Server error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/admin/help-requests/{id}/reject": {
      patch: {
        tags: ["Admin Help Requests"],
        summary: "Reject help request",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Help request rejected.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HelpRequest" },
              },
            },
          },
          500: {
            description: "Server error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/admin/donations": {
      get: {
        tags: ["Admin Donations"],
        summary: "List donations for admin review",
        description:
          "Returns donation records using the currently mounted admin donation route. This route is protected by JWT authentication and admin authorization.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of donation records.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DonationSuccessList" },
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
    "/api/admin/donations/{id}": {
      get: {
        tags: ["Admin Donations"],
        summary: "Get donation by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Donation found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Donation" },
              },
            },
          },
          404: {
            description: "Donation not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          500: {
            description: "Server error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Admin Donations"],
        summary: "Update donation",
        description:
          "Updates an existing donation record using fields already supported by the current Donation model.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DonationUpdateBody" },
            },
          },
        },
        responses: {
          200: {
            description: "Donation updated.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Donation" },
              },
            },
          },
          404: {
            description: "Donation not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          500: {
            description: "Server error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Admin Donations"],
        summary: "Delete donation",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Donation deleted.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DonationDeleteResponse" },
              },
            },
          },
          404: {
            description: "Donation not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          500: {
            description: "Server error.",
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
