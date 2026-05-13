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

  GuardianID: z.string().min(1),
  GuardianName: z.string().min(1),
  GuardianFatherName: z.string().min(1),
  GuardianGrandfatherName: z.string().min(1),
  GuardianFamilyName: z.string().min(1),

  Relation: z.string().min(1),

  country: z.string().min(1),
  city: z.string().min(1),

  phoneNumber: z.string().regex(/^[0-9]{10,15}$/),
  email: z.string().email(),

  paymentMethod: z.enum(["Cash", "BankAccount"]),

  FamilyMember: z.number().min(1),
  MonthlyIncome: z.number().min(0),

  IBAN: z.string().regex(/^[A-Z]{2}[0-9A-Z]{13,32}$/).optional(),
  bankAccount: z.string().regex(/^\d{6,30}$/).optional(),
})
.refine((data) => {
  if (data.paymentMethod === "BankAccount") {
    return !!data.IBAN && !!data.bankAccount;
  }
  return true;
}, {
  message: "IBAN and bankAccount are required when paymentMethod is BankAccount",
})
.refine((data) => {
  if (data.paymentMethod === "Cash") {
    return true;
  }
  return true;
});

module.exports = {
  helpRequestSchema,
};