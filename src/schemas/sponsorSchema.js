const { z } = require("zod");

const phoneRegex = /^[0-9]{10,15}$/;

const sponsorSchema = z.object({
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
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

const sponsorStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});

module.exports = { sponsorSchema, sponsorStatusSchema };