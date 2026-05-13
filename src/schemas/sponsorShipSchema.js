const { z } = require("zod");

const ibanRegex = /^[A-Z]{2}[0-9A-Z]{13,32}$/;

const sponsorShipSchema = z.object({
  orphanId: z.coerce.number().int().positive(),
  sponsorId: z.coerce.number().int().positive(),

  monthlySAmount: z.coerce
    .number()
    .positive()
    .max(99999999.99)
    .refine(
      (n) => Number.isFinite(n) && Math.round(n * 100) / 100 === n,
      { message: "monthlySAmount must have at most 2 decimal places" }
    ),

  startingSDate: z.coerce.date(),
  endSDate: z.coerce.date().optional().nullable(),

  paymentMethod: z.enum([
    "bank_transfer",
    "cash",
    "check",
    "electronic",
  ]),

  bankName: z.string().max(100).optional().nullable(),
  branchNumber: z.string().max(50).optional().nullable(),
  accountNumber: z.string().max(50).optional().nullable(),
  accountHolderName: z.string().max(100).optional().nullable(),
  iban: z.string().max(34).regex(ibanRegex).optional().nullable(),

  status: z
    .enum(["pending", "approved", "rejected", "active", "expired"])
    .optional(),
});

module.exports = {
  sponsorShipSchema,
};
