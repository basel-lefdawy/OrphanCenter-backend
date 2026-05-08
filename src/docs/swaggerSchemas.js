const schemas = {
  ApiSuccess: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Success" },
      data: { nullable: true, example: null },
    },
  },
  ApiError: {
    type: "object",
    required: ["success", "message", "errors"],
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string", example: "Error message" },
      errors: { nullable: true, example: null },
    },
  },
  HealthData: {
    type: "object",
    properties: {
      status: { type: "string", example: "ok" },
    },
  },
  ApiRootData: {
    type: "object",
    properties: {
      name: { type: "string", example: "OrphanCenter API" },
      version: { type: "string", example: "1.0.0" },
    },
  },
  OrphanSummary: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      name: { type: "string", example: "Ahmed Ali" },
      age: { type: "integer", example: 8 },
      gender: { type: "string", example: "male" },
      status: { type: "string", example: "unsponsored" },
      educationLevel: { type: "string", nullable: true, example: "third grade" },
    },
  },
  DonationSummary: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      donorName: { type: "string", example: "Sara Ahmad" },
      amount: { type: "number", example: 500 },
      currency: { type: "string", example: "SAR" },
      type: { type: "string", nullable: true, example: "cash" },
      date: { type: "string", format: "date", nullable: true, example: "2026-05-08" },
      status: { type: "string", example: "pending" },
    },
  },
  DashboardSummary: {
    type: "object",
    required: ["counts", "totalDonations", "sponsorshipRate", "recent"],
    properties: {
      counts: {
        type: "object",
        required: [
          "orphans",
          "sponsors",
          "donations",
          "helpRequests",
          "sponsoredOrphans",
          "pendingHelpRequests",
        ],
        properties: {
          orphans: { type: "integer", example: 8 },
          sponsors: { type: "integer", example: 4 },
          donations: { type: "integer", example: 6 },
          helpRequests: { type: "integer", example: 5 },
          sponsoredOrphans: { type: "integer", example: 4 },
          pendingHelpRequests: { type: "integer", example: 2 },
        },
      },
      totalDonations: { type: "number", example: 50000 },
      sponsorshipRate: { type: "integer", example: 50 },
      recent: {
        type: "object",
        required: ["orphans", "donations"],
        properties: {
          orphans: {
            type: "array",
            items: { $ref: "#/components/schemas/OrphanSummary" },
          },
          donations: {
            type: "array",
            items: { $ref: "#/components/schemas/DonationSummary" },
          },
        },
      },
    },
  },
  HealthResponse: {
    allOf: [
      { $ref: "#/components/schemas/ApiSuccess" },
      {
        type: "object",
        properties: {
          data: { $ref: "#/components/schemas/HealthData" },
        },
      },
    ],
  },
  ApiRootResponse: {
    allOf: [
      { $ref: "#/components/schemas/ApiSuccess" },
      {
        type: "object",
        properties: {
          data: { $ref: "#/components/schemas/ApiRootData" },
        },
      },
    ],
  },
  DashboardResponse: {
    allOf: [
      { $ref: "#/components/schemas/ApiSuccess" },
      {
        type: "object",
        properties: {
          data: { $ref: "#/components/schemas/DashboardSummary" },
        },
      },
    ],
  },
};

module.exports = schemas;
