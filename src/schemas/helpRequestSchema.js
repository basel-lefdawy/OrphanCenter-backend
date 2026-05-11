const { z } = require("zod");

const helpRequestSchema = z.object({
  OrphanID: z.string().min(1),
  OrphanName: z.string().min(1),
  OrphanFatherName: z.string().min(1),
  OrphanGrandfatherName: z.string().min(1),
  OrphanFamilyName: z.string().min(1),

  OrphanBirthDate: z.coerce.date(),

  gender: z.enum(["Male", "Female"]),

  GuaranteeType: z.enum([
    "Educational",
    "Medical",
    "Full",
    "SocialCase",
  ]),

  GuardianID: z.string(),
  GuardianName: z.string(),
  GuardianFatherName: z.string(),
  GuardianGrandfatherName: z.string(),
  GuardianFamilyName: z.string(),

  Relation: z.string(),

  country: z.string(),
  city: z.string(),

  phoneNumber: z.string().regex(/^[0-9]{10,15}$/),

  email: z.string().email(),

  paymentMethod: z.enum(["Cash", "BankAccount"]),

  IBAN: z.string().regex(/^[A-Z]{2}[0-9A-Z]{13,32}$/),

  bankAccount: z.string().regex(/^\d{6,30}$/),

  FamilyMember: z.number().min(1),

  MonthlyIncome: z.number().min(0),
});

module.exports = {
  helpRequestSchema,
};