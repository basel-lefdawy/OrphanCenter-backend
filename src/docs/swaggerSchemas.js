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
    required: [
      "counts",
      "helpRequestStatuses",
      "totalDonations",
      "sponsorshipRate",
      "recent",
      "warnings",
    ],
    properties: {
      counts: {
        type: "object",
        description: "Aggregate dashboard counters returned by the current backend implementation.",
        required: [
          "orphans",
          "sponsors",
          "donations",
          "helpRequests",
          "sponsoredOrphans",
          "pendingHelpRequests",
        ],
        properties: {
          orphans: { type: "integer", example: 0 },
          sponsors: { type: "integer", example: 0 },
          donations: { type: "integer", example: 0 },
          helpRequests: { type: "integer", example: 0 },
          sponsoredOrphans: { type: "integer", example: 0 },
          pendingHelpRequests: { type: "integer", example: 0 },
        },
      },
      helpRequestStatuses: {
        type: "object",
        required: ["pending", "approved", "rejected"],
        properties: {
          pending: { type: "integer", example: 0 },
          approved: { type: "integer", example: 0 },
          rejected: { type: "integer", example: 0 },
        },
        description:
          "Help request counts grouped by the current backend enum values: Pending, Approved, Rejected.",
      },
      totalDonations: { type: "number", example: 0 },
      sponsorshipRate: { type: "integer", example: 0 },
      recent: {
        type: "object",
        required: ["orphans", "donations"],
        description:
          "Recent records for dashboard previews. Arrays may be empty while optional models or database queries are unavailable.",
        properties: {
          orphans: {
            type: "array",
            items: { $ref: "#/components/schemas/OrphanSummary" },
            example: [],
          },
          donations: {
            type: "array",
            items: { $ref: "#/components/schemas/DonationSummary" },
            example: [],
          },
        },
      },
      warnings: {
        type: "array",
        items: { type: "string" },
        example: [
          "Sponsor model is not implemented yet",
          "Donation model is not implemented yet",
          "Orphan model does not define sponsorId; sponsored count defaults to 0",
        ],
        description:
          "Temporary-safe warnings returned when optional dashboard data sources are missing or unavailable.",
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
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Success" },
      data: { $ref: "#/components/schemas/DashboardSummary" },
    },
    example: {
      success: true,
      message: "Success",
      data: {
        counts: {
          orphans: 0,
          sponsors: 0,
          donations: 0,
          helpRequests: 0,
          sponsoredOrphans: 0,
          pendingHelpRequests: 0,
        },
        helpRequestStatuses: {
          pending: 0,
          approved: 0,
          rejected: 0,
        },
        totalDonations: 0,
        sponsorshipRate: 0,
        recent: {
          orphans: [],
          donations: [],
        },
        warnings: [
          "Sponsor model is not implemented yet",
          "Donation model is not implemented yet",
          "Orphan model does not define sponsorId; sponsored count defaults to 0",
        ],
      },
    },
  },
};

module.exports = schemas;
