const { z } = require("zod");

const phoneRegex = /^[0-9]{10,15}$/;

const sponsorshipRequestBaseSchema = z.object({
  // ─── معلومات الكفيل ─────────────────────────────────
  identityNumber: z.string().min(1).max(20),
  firstName: z.string().min(1).max(50),
  fatherName: z.string().min(1).max(50),
  grandfatherName: z.string().min(1).max(50),
  familyName: z.string().min(1).max(50),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(["male", "female"]),
  jobType: z.string().min(1).max(100),
  country: z.string().min(1).max(60),
  city: z.string().min(1).max(60),
  street: z.string().max(100).optional().nullable(),
  mobile: z.string().regex(phoneRegex).max(20),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email().max(100),

  // ─── معلومات المفوض ──────────────────────────────────
  delegateIdentityNumber: z.string().max(20).optional().nullable(),
  delegateFirstName: z.string().max(50).optional().nullable(),
  delegateFatherName: z.string().max(50).optional().nullable(),
  delegateGrandfatherName: z.string().max(50).optional().nullable(),
  delegateFamilyName: z.string().max(50).optional().nullable(),
  delegateJobType: z.string().max(100).optional().nullable(),
  delegateGender: z.enum(["male", "female"]).optional().nullable(),
  delegateRelationship: z.string().max(50).optional().nullable(),
  delegateCountry: z.string().max(60).optional().nullable(),
  delegateCity: z.string().max(60).optional().nullable(),
  delegateStreet: z.string().max(100).optional().nullable(),
  delegateMobile: z.string().regex(phoneRegex).max(20).optional().nullable(),

  // ─── تفاصيل الكفالة ──────────────────────────────────
  orphanId: z.number().int().positive(),
  monthlySAmount: z.number().positive(),
  startingSDate: z.coerce.date(),
  endSDate: z.coerce.date().optional().nullable(),
  paymentMethod: z.enum(["bank_transfer", "cash", "check", "electronic"]),
  bankName: z.string().max(100).optional().nullable(),
  branchNumber: z.string().max(50).optional().nullable(),
  accountNumber: z.string().max(50).optional().nullable(),
  accountHolderName: z.string().max(100).optional().nullable(),
  iban: z.string().max(34).optional().nullable(),

  // ─── حالة الطلب ──────────────────────────────────────
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

const sponsorshipRequestSchema = sponsorshipRequestBaseSchema.refine(
  (data) => {
    if (data.paymentMethod === "bank_transfer") {
      return (
        !!data.bankName &&
        !!data.branchNumber &&
        !!data.accountNumber &&
        !!data.accountHolderName &&
        !!data.iban
      );
    }
    return true;
  },
  {
    message:
      "bankName, branchNumber, accountNumber, accountHolderName, and iban are required when paymentMethod is bank_transfer",
    path: ["paymentMethod"],
  }
);

const sponsorshipRequestUpdateSchema = sponsorshipRequestBaseSchema.partial().refine(
  (data) => {
    if (data.paymentMethod === "bank_transfer") {
      return (
        !!data.bankName &&
        !!data.branchNumber &&
        !!data.accountNumber &&
        !!data.accountHolderName &&
        !!data.iban
      );
    }
    return true;
  },
  {
    message:
      "bankName, branchNumber, accountNumber, accountHolderName, and iban are required when paymentMethod is bank_transfer",
    path: ["paymentMethod"],
  }
);

module.exports = { sponsorshipRequestSchema, sponsorshipRequestUpdateSchema };