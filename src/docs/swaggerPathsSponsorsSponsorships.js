/**
 * OpenAPI path definitions for /api/sponsors and /api/sponsorships.
 * Merged into swagger.js `paths`.
 */

const json = (schemaRef) => ({
  "application/json": {
    schema: { $ref: `#/components/schemas/${schemaRef}` },
  },
});

const err = {
  400: {
    description: "Validation or bad request",
    content: json("CrudJsonError"),
  },
  404: {
    description: "Resource not found",
    content: json("CrudJsonError"),
  },
  409: {
    description: "Conflict (e.g. duplicate identity or email)",
    content: json("CrudJsonError"),
  },
  500: {
    description: "Server error",
    content: json("CrudJsonError"),
  },
};

module.exports = {
  "/api/sponsors": {
    get: {
      tags: ["Sponsors"],
      summary: "List all sponsors",
      description: "Returns all sponsors with their sponsorship summaries included.",
      responses: {
        200: {
          description: "List of sponsors",
          content: json("SponsorSuccessList"),
        },
        500: err[500],
      },
    },
    post: {
      tags: ["Sponsors"],
      summary: "Create sponsor",
      description:
        "Creates a new sponsor. Required: identityNumber, firstName, fatherName, grandfatherName, familyName, dateOfBirth, gender, jobType, country, city, mobile, email.",
      requestBody: {
        required: true,
        content: json("SponsorCreateBody"),
      },
      responses: {
        201: {
          description: "Created",
          content: json("SponsorSuccessOne"),
        },
        ...err,
      },
    },
  },

  "/api/sponsors/{id}": {
    get: {
      tags: ["Sponsors"],
      summary: "Get sponsor by id",
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
          description: "Sponsor found",
          content: json("SponsorSuccessOne"),
        },
        404: err[404],
        500: err[500],
      },
    },
    put: {
      tags: ["Sponsors"],
      summary: "Update sponsor",
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
        content: json("SponsorUpdateBody"),
      },
      responses: {
        200: {
          description: "Updated",
          content: json("SponsorSuccessOne"),
        },
        404: err[404],
        409: err[409],
        500: err[500],
      },
    },
    delete: {
      tags: ["Sponsors"],
      summary: "Delete sponsor (soft delete)",
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
          description: "Deleted",
          content: json("CrudMessageResponse"),
        },
        404: err[404],
        500: err[500],
      },
    },
  },

  "/api/sponsors/{id}/status": {
    patch: {
      tags: ["Sponsors"],
      summary: "Update sponsor status",
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
        content: json("SponsorStatusBody"),
      },
      responses: {
        200: {
          description: "Status updated",
          content: json("SponsorSuccessOne"),
        },
        400: err[400],
        404: err[404],
        500: err[500],
      },
    },
  },

  "/api/sponsors/{sponsorId}/sponsorships": {
    get: {
      tags: ["Sponsors"],
      summary: "List sponsorships for a sponsor",
      description: "Returns sponsorships for the given sponsorId, each with orphan included.",
      parameters: [
        {
          name: "sponsorId",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: {
          description: "List of sponsorships",
          content: json("SponsorshipSuccessList"),
        },
        404: err[404],
        500: err[500],
      },
    },
  },

  "/api/sponsorships": {
    get: {
      tags: ["Sponsorships"],
      summary: "List all sponsorships",
      description: "Returns all sponsorships with sponsor and orphan included.",
      responses: {
        200: {
          description: "List of sponsorships",
          content: json("SponsorshipSuccessList"),
        },
        500: err[500],
      },
    },
    post: {
      tags: ["Sponsorships"],
      summary: "Create sponsorship",
      description:
        "When paymentMethod is `bank_transfer`, bankName, accountNumber, accountHolderName, and iban are required.",
      requestBody: {
        required: true,
        content: json("SponsorshipCreateBody"),
      },
      responses: {
        201: {
          description: "Created",
          content: json("SponsorshipSuccessOne"),
        },
        ...err,
      },
    },
  },

  "/api/sponsorships/{id}": {
    get: {
      tags: ["Sponsorships"],
      summary: "Get sponsorship by id",
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
          description: "Sponsorship found",
          content: json("SponsorshipSuccessOne"),
        },
        404: err[404],
        500: err[500],
      },
    },
    put: {
      tags: ["Sponsorships"],
      summary: "Update sponsorship",
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
        content: json("SponsorshipUpdateBody"),
      },
      responses: {
        200: {
          description: "Updated",
          content: json("SponsorshipSuccessOne"),
        },
        404: err[404],
        500: err[500],
      },
    },
    delete: {
      tags: ["Sponsorships"],
      summary: "Delete sponsorship (soft delete)",
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
          description: "Deleted",
          content: json("CrudMessageResponse"),
        },
        404: err[404],
        500: err[500],
      },
    },
  },

  "/api/sponsorships/{id}/status": {
    patch: {
      tags: ["Sponsorships"],
      summary: "Update sponsorship status",
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
        content: json("SponsorshipStatusBody"),
      },
      responses: {
        200: {
          description: "Status updated",
          content: json("SponsorshipSuccessOne"),
        },
        400: err[400],
        404: err[404],
        500: err[500],
      },
    },
  },
};
