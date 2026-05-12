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

  CrudMessageResponse: {
    type: "object",
    required: ["success", "message"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "تم حذف الكفيل بنجاح" },
    },
  },

  SponsorShallow: {
    type: "object",
    description: "Minimal sponsor shape when nested under a sponsorship (avoids circular refs).",
    properties: {
      id: { type: "integer", example: 2 },
      identityNumber: { type: "string" },
      firstName: { type: "string" },
      familyName: { type: "string" },
      email: { type: "string", format: "email" },
      status: { type: "string", enum: ["active", "inactive"] },
    },
  },

  SponsorshipSummary: {
    type: "object",
    description: "Sponsorship without nested sponsor/orphan (used under sponsor detail).",
    properties: {
      id: { type: "integer" },
      orphanId: { type: "integer" },
      sponsorId: { type: "integer" },
      monthlySAmount: { type: "number" },
      startingSDate: { type: "string", format: "date" },
      endSDate: { type: "string", format: "date", nullable: true },
      paymentMethod: {
        type: "string",
        enum: ["bank_transfer", "cash", "check", "electronic"],
      },
      status: {
        type: "string",
        enum: ["pending", "approved", "rejected", "active", "expired"],
      },
      bankName: { type: "string", nullable: true },
      branchNumber: { type: "string", nullable: true },
      accountNumber: { type: "string", nullable: true },
      accountHolderName: { type: "string", nullable: true },
      iban: { type: "string", nullable: true },
      createdAt: { type: "string", format: "date-time", nullable: true },
      updatedAt: { type: "string", format: "date-time", nullable: true },
    },
  },

  Sponsor: {
    type: "object",
    description: "Sponsor (كفيل) record as returned by Sequelize (camelCase fields).",
    properties: {
      id: { type: "integer", example: 1 },
      identityNumber: { type: "string", example: "1234567890" },
      firstName: { type: "string" },
      fatherName: { type: "string" },
      grandfatherName: { type: "string" },
      familyName: { type: "string" },
      dateOfBirth: { type: "string", format: "date", example: "1985-01-15" },
      gender: { type: "string", enum: ["male", "female"] },
      jobType: { type: "string" },
      country: { type: "string" },
      city: { type: "string" },
      street: { type: "string", nullable: true },
      mobile: { type: "string" },
      phone: { type: "string", nullable: true },
      email: { type: "string", format: "email" },
      delegateIdentityNumber: { type: "string", nullable: true },
      delegateFirstName: { type: "string", nullable: true },
      delegateFatherName: { type: "string", nullable: true },
      delegateGrandfatherName: { type: "string", nullable: true },
      delegateFamilyName: { type: "string", nullable: true },
      delegateJobType: { type: "string", nullable: true },
      delegateGender: { type: "string", enum: ["male", "female"], nullable: true },
      delegateRelationship: { type: "string", nullable: true },
      delegateCountry: { type: "string", nullable: true },
      delegateCity: { type: "string", nullable: true },
      delegateStreet: { type: "string", nullable: true },
      delegateMobile: { type: "string", nullable: true },
      status: { type: "string", enum: ["active", "inactive"], example: "active" },
      createdAt: { type: "string", format: "date-time", nullable: true },
      updatedAt: { type: "string", format: "date-time", nullable: true },
      deletedAt: { type: "string", format: "date-time", nullable: true },
      sponsorships: {
        type: "array",
        items: { $ref: "#/components/schemas/SponsorshipSummary" },
        description: "Included on sponsor list/detail when loaded with association.",
      },
    },
  },

  SponsorCreateBody: {
    type: "object",
    required: [
      "identityNumber",
      "firstName",
      "fatherName",
      "grandfatherName",
      "familyName",
      "dateOfBirth",
      "gender",
      "jobType",
      "country",
      "city",
      "mobile",
      "email",
    ],
    properties: {
      identityNumber: { type: "string" },
      firstName: { type: "string" },
      fatherName: { type: "string" },
      grandfatherName: { type: "string" },
      familyName: { type: "string" },
      dateOfBirth: { type: "string", format: "date" },
      gender: { type: "string", enum: ["male", "female"] },
      jobType: { type: "string" },
      country: { type: "string" },
      city: { type: "string" },
      street: { type: "string" },
      mobile: { type: "string" },
      phone: { type: "string" },
      email: { type: "string", format: "email" },
      delegateIdentityNumber: { type: "string" },
      delegateFirstName: { type: "string" },
      delegateFatherName: { type: "string" },
      delegateGrandfatherName: { type: "string" },
      delegateFamilyName: { type: "string" },
      delegateJobType: { type: "string" },
      delegateGender: { type: "string", enum: ["male", "female"] },
      delegateRelationship: { type: "string" },
      delegateCountry: { type: "string" },
      delegateCity: { type: "string" },
      delegateStreet: { type: "string" },
      delegateMobile: { type: "string" },
    },
  },

  SponsorUpdateBody: {
    type: "object",
    description: "Partial sponsor fields (same shape as create; all optional for update).",
    additionalProperties: true,
  },

  SponsorStatusBody: {
    type: "object",
    required: ["status"],
    properties: {
      status: { type: "string", enum: ["active", "inactive"], example: "inactive" },
    },
  },

  Sponsorship: {
    allOf: [
      { $ref: "#/components/schemas/SponsorshipSummary" },
      {
        type: "object",
        properties: {
          deletedAt: { type: "string", format: "date-time", nullable: true },
          sponsor: { $ref: "#/components/schemas/SponsorShallow" },
          orphan: {
            type: "object",
            nullable: true,
            description: "Orphan row when association is loaded.",
            additionalProperties: true,
          },
        },
      },
    ],
    description: "Sponsorship (كفالة) with optional nested sponsor/orphan from API includes.",
  },

  SponsorshipCreateBody: {
    type: "object",
    required: ["orphanId", "sponsorId", "monthlySAmount", "startingSDate", "paymentMethod"],
    properties: {
      orphanId: { type: "integer" },
      sponsorId: { type: "integer" },
      monthlySAmount: { type: "number" },
      startingSDate: { type: "string", format: "date" },
      endSDate: { type: "string", format: "date" },
      paymentMethod: {
        type: "string",
        enum: ["bank_transfer", "cash", "check", "electronic"],
      },
      bankName: { type: "string", description: "Required when paymentMethod is bank_transfer" },
      branchNumber: { type: "string" },
      accountNumber: { type: "string", description: "Required when paymentMethod is bank_transfer" },
      accountHolderName: { type: "string", description: "Required when paymentMethod is bank_transfer" },
      iban: { type: "string", description: "Required when paymentMethod is bank_transfer" },
    },
  },

  SponsorshipUpdateBody: {
    type: "object",
    description: "Partial sponsorship update; bank fields cleared when paymentMethod is not bank_transfer.",
    additionalProperties: true,
  },

  SponsorshipStatusBody: {
    type: "object",
    required: ["status"],
    properties: {
      status: {
        type: "string",
        enum: ["pending", "approved", "rejected", "active", "expired"],
        example: "approved",
      },
    },
  },

  SponsorSuccessList: {
    type: "object",
    required: ["success", "data"],
    properties: {
      success: { type: "boolean", example: true },
      data: { type: "array", items: { $ref: "#/components/schemas/Sponsor" } },
    },
  },

  SponsorSuccessOne: {
    type: "object",
    required: ["success", "data"],
    properties: {
      success: { type: "boolean", example: true },
      data: { $ref: "#/components/schemas/Sponsor" },
    },
  },

  SponsorshipSuccessList: {
    type: "object",
    required: ["success", "data"],
    properties: {
      success: { type: "boolean", example: true },
      data: { type: "array", items: { $ref: "#/components/schemas/Sponsorship" } },
    },
  },

  SponsorshipSuccessOne: {
    type: "object",
    required: ["success", "data"],
    properties: {
      success: { type: "boolean", example: true },
      data: { $ref: "#/components/schemas/Sponsorship" },
    },
  },

  CrudJsonError: {
    type: "object",
    required: ["success", "message"],
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string", example: "الكفيل غير موجود" },
    },
  },
};

module.exports = schemas;
