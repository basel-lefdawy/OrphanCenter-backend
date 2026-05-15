const { z } = require("zod");

const sponsorshipBaseSchema = z.object({
  sponsorId: z.number().int().positive(),
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
  status: z.enum(["pending", "approved", "rejected", "active", "expired"]).optional(),
});

const sponsorshipSchema = sponsorshipBaseSchema.refine(
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

const sponsorshipUpdateSchema = sponsorshipBaseSchema.partial().refine(
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

const sponsorshipStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "active", "expired"]),
});

module.exports = { sponsorshipSchema, sponsorshipUpdateSchema, sponsorshipStatusSchema };