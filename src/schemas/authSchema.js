const { z } = require("zod");

const passwordSchema = z
  .string()
  .min(8, "Password must be between 8 and 128 characters")
  .max(128, "Password must be between 8 and 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[@$!%*?&_\-#^]/,
    "Password must contain at least one special character (@$!%*?&_-#^)"
  );

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be between 2 and 50 characters")
      .max(50, "Name must be between 2 and 50 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    email: z.string().trim().min(1, "Email is required").email("Invalid email format").max(254),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required").max(128, "Invalid credentials"),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

const verifyEmailSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  token: z.string().min(1, "Verification token is required"),
});

const resetPasswordSchema = z
  .object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
    token: z.string().min(1, "Reset token is required"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
};
