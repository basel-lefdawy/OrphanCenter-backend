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
  AuthUser: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      provider: { type: "string", example: "facebook" },
      name: { type: "string", example: "Facebook User" },
      email: { type: "string", nullable: true, example: "user@example.com" },
      role: { type: "string", example: "user" },
    },
  },
  RegisterBody: {
    type: "object",
    required: ["name", "email", "password", "confirmPassword"],
    properties: {
      name: { type: "string", minLength: 2, maxLength: 50, example: "Demo Admin" },
      email: { type: "string", format: "email", example: "admin@example.com" },
      password: { type: "string", minLength: 8, maxLength: 128, example: "Password1!" },
      confirmPassword: { type: "string", example: "Password1!" },
    },
  },
  LoginBody: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email", example: "admin@example.com" },
      password: { type: "string", example: "Password1!" },
    },
  },
  RefreshTokenBody: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: { type: "string", example: "eyJhbGciOi..." },
    },
  },
  VerifyEmailBody: {
    type: "object",
    required: ["email", "token"],
    properties: {
      email: { type: "string", format: "email", example: "admin@example.com" },
      token: { type: "string", example: "email-verification-token" },
    },
  },
  ForgotPasswordBody: {
    type: "object",
    required: ["email"],
    properties: {
      email: { type: "string", format: "email", example: "admin@example.com" },
    },
  },
  ResetPasswordBody: {
    type: "object",
    required: ["email", "token", "password", "confirmPassword"],
    properties: {
      email: { type: "string", format: "email", example: "admin@example.com" },
      token: { type: "string", example: "reset-token" },
      password: { type: "string", minLength: 8, maxLength: 128, example: "NewPassword1!" },
      confirmPassword: { type: "string", example: "NewPassword1!" },
    },
  },
  AuthTokens: {
    type: "object",
    properties: {
      accessToken: { type: "string", example: "eyJhbGciOi..." },
      refreshToken: { type: "string", example: "eyJhbGciOi..." },
    },
  },
  AuthResponse: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Logged in successfully" },
      data: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/AuthUser" },
          accessToken: { type: "string", example: "eyJhbGciOi..." },
          refreshToken: { type: "string", example: "eyJhbGciOi..." },
          message: { type: "string", example: "Verification email sent. Please check your inbox to complete registration." },
        },
        additionalProperties: true,
      },
    },
  },
  CurrentUserResponse: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Success" },
      data: {
        type: "object",
        required: ["user"],
        properties: {
          user: { $ref: "#/components/schemas/AuthUser" },
        },
      },
    },
    example: {
      success: true,
      message: "Success",
      data: {
        user: {
          id: 1,
          provider: "facebook",
          name: "Facebook User",
          email: "user@example.com",
          role: "user",
        },
      },
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
        example: [],
        description:
          "Warnings returned only if a dashboard data source cannot be queried.",
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
        warnings: [],
      },
    },
  },

  HelpRequest: {
    type: "object",
    description: "Help request record as returned by the current HelpRequest service.",
    properties: {
      id: { type: "integer", example: 1 },
      OrphanID: { type: "string", example: "OR-1001" },
      OrphanName: { type: "string", example: "Ahmed" },
      OrphanFatherName: { type: "string", example: "Ali" },
      OrphanGrandfatherName: { type: "string", example: "Hassan" },
      OrphanFamilyName: { type: "string", example: "Saleh" },
      OrphanBirthDate: { type: "string", format: "date", example: "2018-05-10" },
      gender: { type: "string", enum: ["Male", "Female"], example: "Male" },
      GuaranteeType: {
        type: "string",
        enum: ["Educational", "Medical", "Full", "SocialCase"],
        example: "Educational",
      },
      GuardianID: { type: "string", example: "G-1001" },
      GuardianName: { type: "string", example: "Mona" },
      GuardianFatherName: { type: "string", example: "Khaled" },
      GuardianGrandfatherName: { type: "string", example: "Yousef" },
      GuardianFamilyName: { type: "string", example: "Saleh" },
      Relation: { type: "string", example: "Mother" },
      country: { type: "string", example: "Palestine" },
      city: { type: "string", example: "Gaza" },
      street: { type: "string", nullable: true, example: "Main Street" },
      phoneNumber: { type: "string", example: "0591234567" },
      email: { type: "string", format: "email", example: "guardian@example.com" },
      paymentMethod: { type: "string", enum: ["Cash", "BankAccount"], example: "Cash" },
      IBAN: { type: "string", nullable: true, example: "PS92PALS000000000400123456702" },
      bankAccount: { type: "string", nullable: true, example: "1234567890" },
      FamilyMember: { type: "integer", example: 5 },
      MonthlyIncome: { type: "number", example: 1200 },
      status: { type: "string", enum: ["Pending", "Approved", "Rejected"], example: "Pending" },
      createdAt: { type: "string", format: "date-time", nullable: true },
      updatedAt: { type: "string", format: "date-time", nullable: true },
    },
  },

  HelpRequestCreateBody: {
    type: "object",
    required: [
      "OrphanID",
      "OrphanName",
      "OrphanFatherName",
      "OrphanGrandfatherName",
      "OrphanFamilyName",
      "OrphanBirthDate",
      "gender",
      "GuaranteeType",
      "GuardianID",
      "GuardianName",
      "GuardianFatherName",
      "GuardianGrandfatherName",
      "GuardianFamilyName",
      "Relation",
      "country",
      "city",
      "street",
      "phoneNumber",
      "email",
      "paymentMethod",
      "FamilyMember",
      "MonthlyIncome",
    ],
    properties: {
      OrphanID: { type: "string" },
      OrphanName: { type: "string" },
      OrphanFatherName: { type: "string" },
      OrphanGrandfatherName: { type: "string" },
      OrphanFamilyName: { type: "string" },
      OrphanBirthDate: { type: "string", format: "date" },
      gender: { type: "string", enum: ["Male", "Female"] },
      GuaranteeType: {
        type: "string",
        enum: ["Educational", "Medical", "Full", "SocialCase"],
      },
      GuardianID: { type: "string" },
      GuardianName: { type: "string" },
      GuardianFatherName: { type: "string" },
      GuardianGrandfatherName: { type: "string" },
      GuardianFamilyName: { type: "string" },
      Relation: { type: "string" },
      country: { type: "string" },
      city: { type: "string" },
      street: { type: "string" },
      phoneNumber: { type: "string", pattern: "^\\d{10}$" },
      homePhone: { type: "string", pattern: "^\\d{7}$" },
      email: { type: "string", format: "email" },
      paymentMethod: { type: "string", enum: ["Cash", "BankAccount"] },
      FamilyMember: { type: "integer", minimum: 1 },
      MonthlyIncome: { type: "number", minimum: 0 },
      IBAN: {
        type: "string",
        pattern: "^[A-Z]{2}[0-9A-Z]{13,32}$",
        description: "Required when paymentMethod is BankAccount.",
      },
      bankAccount: {
        type: "string",
        description: "Required when paymentMethod is BankAccount.",
      },
      FatherDeathDate: { type: "string", format: "date" },
      MotherDeathDate: { type: "string", format: "date" },
      DeceasedPerson: { type: "string", enum: ["Father", "Mother", "Both"] },
    },
  },

  HelpRequestUpdateBody: {
    type: "object",
    description: "Partial help request update body accepted by the current admin update route.",
    additionalProperties: false,
    properties: {
      status: {
        type: "string",
        enum: ["Pending", "Approved", "Rejected"],
        example: "Approved",
      },
    },
  },

  HelpRequestSuccessOne: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "طھظ… ط¥ط±ط³ط§ظ„ ط·ظ„ط¨ ط§ظ„ظ…ط³ط§ط¹ط¯ط© ط¨ظ†ط¬ط§ط­" },
      data: { $ref: "#/components/schemas/HelpRequest" },
    },
  },
  HelpRequestApprovalResponse: {
    type: "object",
    description: "Raw approval result returned by the current help request controller.",
    properties: {
      req: { $ref: "#/components/schemas/HelpRequest" },
      guardian: { type: "object", additionalProperties: true },
      orphan: { type: "object", additionalProperties: true },
    },
    additionalProperties: true,
  },

  HelpRequestSuccessList: {
    type: "array",
    items: { $ref: "#/components/schemas/HelpRequest" },
  },

  HelpRequestDeleteResponse: {
    type: "object",
    required: ["success"],
    properties: {
      success: { type: "boolean", example: true },
    },
  },

  Donation: {
    type: "object",
    description: "Donation record as returned by the current donation admin API.",
    properties: {
      id: { type: "integer", example: 1 },
      donationNumber: { type: "string", example: "DON-20260515-001" },
      userId: { type: "integer", nullable: true, example: null },
      donorName: { type: "string", example: "Anonymous" },
      isAnonymous: { type: "boolean", example: false },
      amount: { type: "number", example: 50 },
      currency: { type: "string", example: "ils" },
      method: { type: "string", nullable: true, example: "card" },
      status: { type: "string", example: "pending" },
      paymentIntentId: { type: "string", nullable: true, example: "pi_123" },
      email: { type: "string", nullable: true, example: "donor@example.com" },
      createdAt: { type: "string", format: "date-time", nullable: true },
      updatedAt: { type: "string", format: "date-time", nullable: true },
    },
  },

  DonationUpdateBody: {
    type: "object",
    description:
      "Partial donation fields accepted by the current admin update route. Use only for admin workflow fields that already exist on the Donation model.",
    additionalProperties: false,
    properties: {
      donorName: { type: "string" },
      isAnonymous: { type: "boolean" },
      amount: { type: "number" },
      currency: { type: "string" },
      method: { type: "string" },
      status: { type: "string", example: "paid" },
      email: { type: "string", format: "email" },
    },
  },

  DonationSuccessList: {
    type: "array",
    items: { $ref: "#/components/schemas/Donation" },
  },

  DonationDeleteResponse: {
    type: "object",
    required: ["success"],
    properties: {
      success: { type: "boolean", example: true },
    },
  },

  Orphan: {
    type: "object",
    description: "Orphan record as returned by the current Orphan model (GET /api/orphans).",
    properties: {
      id: { type: "integer", example: 1 },
      OrphanID: { type: "string", example: "OR-1001" },
      OrphanName: { type: "string", example: "Ahmed" },
      OrphanFatherName: { type: "string", example: "Ali" },
      OrphanGrandfatherName: { type: "string", example: "Hassan" },
      OrphanFamilyName: { type: "string", example: "Saleh" },
      OrphanBirthDate: { type: "string", format: "date", example: "2018-05-10" },
      gender: { type: "string", example: "Male" },
      GuaranteeType: { type: "string", example: "Educational" },
      description: { type: "string", nullable: true, example: "Needs school and living support" },
      GuardianID: { type: "string", example: "G-1001" },
      RequestID: { type: "integer", nullable: true, example: 1 },
    },
  },

  OrphanList: {
    type: "array",
    items: { $ref: "#/components/schemas/Orphan" },
  },
  OrphanCreateBody: {
    type: "object",
    required: ["OrphanID", "GuardianID"],
    properties: {
      OrphanID: { type: "string", example: "123456789" },
      OrphanName: { type: "string", example: "Ahmed" },
      OrphanFatherName: { type: "string", example: "Ali" },
      OrphanGrandfatherName: { type: "string", example: "Hassan" },
      OrphanFamilyName: { type: "string", example: "Saleh" },
      OrphanBirthDate: { type: "string", format: "date", example: "2018-05-10" },
      gender: { type: "string", example: "Male" },
      GuaranteeType: { type: "string", example: "Educational" },
      description: { type: "string", nullable: true },
      GuardianID: { type: "string", example: "987654321" },
      RequestID: { type: "integer", nullable: true },
    },
  },
  OrphanUpdateBody: {
    type: "object",
    description: "Partial orphan fields accepted by the current admin update route.",
    additionalProperties: true,
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
      status: { type: "string", enum: ["pending", "approved", "rejected"] },
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
      status: { type: "string", enum: ["pending", "approved", "rejected"], example: "pending" },
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
      status: { type: "string", enum: ["pending", "approved", "rejected"], example: "approved" },
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
  SponsorshipRequest: {
    type: "object",
    description: "Sponsorship request record returned by the sponsorship request API.",
    additionalProperties: true,
    properties: {
      id: { type: "integer", example: 1 },
      userId: { type: "integer", example: 1 },
      identityNumber: { type: "string", example: "123456789" },
      firstName: { type: "string", example: "Hanan" },
      familyName: { type: "string", example: "Saber" },
      orphanId: { type: "integer", example: 1 },
      monthlySAmount: { type: "number", example: 100 },
      paymentMethod: { type: "string", enum: ["bank_transfer", "cash", "check", "electronic"] },
      status: { type: "string", enum: ["pending", "approved", "rejected"], example: "pending" },
      createdAt: { type: "string", format: "date-time", nullable: true },
      updatedAt: { type: "string", format: "date-time", nullable: true },
    },
  },
  SponsorshipRequestBody: {
    type: "object",
    description:
      "Create body combines sponsor identity fields with sponsorship fields. Requires authentication; userId is taken from the JWT, not from the request body.",
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
      "orphanId",
      "monthlySAmount",
      "startingSDate",
      "paymentMethod",
    ],
    properties: {
      identityNumber: { type: "string", example: "123456789" },
      firstName: { type: "string", example: "Hanan" },
      fatherName: { type: "string", example: "Ali" },
      grandfatherName: { type: "string", example: "Mahmoud" },
      familyName: { type: "string", example: "Saber" },
      dateOfBirth: { type: "string", format: "date", example: "1985-01-15" },
      gender: { type: "string", enum: ["male", "female"] },
      jobType: { type: "string", example: "Teacher" },
      country: { type: "string", example: "Palestine" },
      city: { type: "string", example: "Gaza" },
      street: { type: "string", nullable: true },
      mobile: { type: "string", example: "0591234567" },
      phone: { type: "string", nullable: true },
      email: { type: "string", format: "email", example: "sponsor@example.com" },
      orphanId: { type: "integer", example: 1 },
      monthlySAmount: { type: "number", example: 100 },
      startingSDate: { type: "string", format: "date", example: "2026-05-16" },
      endSDate: { type: "string", format: "date", nullable: true },
      paymentMethod: { type: "string", enum: ["bank_transfer", "cash", "check", "electronic"] },
      bankName: { type: "string", nullable: true },
      branchNumber: { type: "string", nullable: true },
      accountNumber: { type: "string", nullable: true },
      accountHolderName: { type: "string", nullable: true },
      iban: { type: "string", nullable: true },
      status: { type: "string", enum: ["pending", "approved", "rejected"] },
    },
  },
  SponsorshipRequestUpdateBody: {
    type: "object",
    description: "Partial sponsorship request update body accepted by the admin update route.",
    additionalProperties: true,
  },
  SponsorshipRequestSuccessOne: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Success" },
      data: { $ref: "#/components/schemas/SponsorshipRequest" },
    },
  },
  SponsorshipRequestSuccessList: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Success" },
      data: { type: "array", items: { $ref: "#/components/schemas/SponsorshipRequest" } },
    },
  },

  SponsorSuccessList: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Success" },
      data: { type: "array", items: { $ref: "#/components/schemas/Sponsor" } },
    },
  },

  SponsorSuccessOne: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Success" },
      data: { $ref: "#/components/schemas/Sponsor" },
    },
  },

  SponsorshipSuccessList: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Success" },
      data: { type: "array", items: { $ref: "#/components/schemas/Sponsorship" } },
    },
  },

  SponsorshipSuccessOne: {
    type: "object",
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Success" },
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
