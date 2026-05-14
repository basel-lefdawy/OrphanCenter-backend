const { z } = require("zod");

const palestinianIdRegex = /^\d{9}$/;
const phoneRegex = /^\d{10}$/;
const homePhoneRegex = /^\d{7}$/;

// تنظيف أي قيمة فاضية من التاريخ
const optionalDate = z.preprocess(
  (val) => (val === "" || val === null ? undefined : val),
  z.coerce.date().optional()
);

const helpRequestSchema = z.object({
  OrphanID: z.string().regex(palestinianIdRegex, "رقم هوية اليتيم غير صالح"),

  OrphanName: z.string().min(2),
  OrphanFatherName: z.string().min(2),
  OrphanGrandfatherName: z.string().min(2),
  OrphanFamilyName: z.string().min(2),

  OrphanBirthDate: z.coerce.date(),

  gender: z.enum(["Male", "Female"]),

  GuaranteeType: z.enum([
    "Educational",
    "Medical",
    "Full",
    "SocialCase",
  ]),

  GuardianID: z.string().regex(palestinianIdRegex, "رقم هوية الوصي غير صالح"),

  GuardianName: z.string().min(2),
  GuardianFatherName: z.string().min(2),
  GuardianGrandfatherName: z.string().min(2),
  GuardianFamilyName: z.string().min(2),

  Relation: z.string().min(2),

  country: z.string().min(1),
  city: z.string().min(1),
  street: z.string().min(1, "الشارع مطلوب"),

  phoneNumber: z.string().regex(phoneRegex, "رقم الجوال يجب أن يكون 10 أرقام"),

  homePhone: z.string().regex(homePhoneRegex).optional().or(z.literal("")),

  email: z.string().email(),

  paymentMethod: z.enum(["Cash", "BankAccount"]),

  FamilyMember: z.coerce.number().min(1),
  MonthlyIncome: z.coerce.number().min(0),

  IBAN: z.string().optional(),
  bankAccount: z.string().optional(),

  FatherDeathDate: optionalDate,
  MotherDeathDate: optionalDate,

  DeceasedPerson: z.enum(["Father", "Mother", "Both"]).optional(),
})
<<<<<<< Updated upstream
.refine((data) => {
  if (data.paymentMethod === "BankAccount") {
    return !!data.IBAN && !!data.bankAccount;
=======
.superRefine((data, ctx) => {

  const birth = new Date(data.OrphanBirthDate);
  const today = new Date();

  const father = data.FatherDeathDate ? new Date(data.FatherDeathDate) : null;
  const mother = data.MotherDeathDate ? new Date(data.MotherDeathDate) : null;

  const isFather = data.DeceasedPerson === "Father" || data.DeceasedPerson === "Both";
  const isMother = data.DeceasedPerson === "Mother" || data.DeceasedPerson === "Both";

  // FATHER 
  if (isFather && father) {

    if (father > today) {
      ctx.addIssue({
        path: ["FatherDeathDate"],
        message: "تاريخ وفاة الأب لا يمكن أن يكون في المستقبل",
      });
    }

    const conception = new Date(birth);
    conception.setMonth(conception.getMonth() - 9);

    if (father < conception) {
      ctx.addIssue({
        path: ["FatherDeathDate"],
        message: "تاريخ وفاة الأب غير منطقي مع فترة الحمل",
      });
    }
>>>>>>> Stashed changes
  }

  //  MOTHER 
  if (isMother && mother) {

    if (mother > today) {
      ctx.addIssue({
        path: ["MotherDeathDate"],
        message: "تاريخ وفاة الأم لا يمكن أن يكون في المستقبل",
      });
    }

    if (mother < birth) {
      ctx.addIssue({
        path: ["MotherDeathDate"],
        message: "تاريخ وفاة الأم غير منطقي",
      });
    }
  }
});

module.exports = { helpRequestSchema };