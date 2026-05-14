const { body, validationResult } = require("express-validator");

// ─── Reusable field rules ────────────────────────────────────────────────────

const nameRule = body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("Name can only contain letters, spaces, hyphens, and apostrophes")
    .escape(); // Sanitize against XSS

const emailRule = body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .isLength({ max: 254 }) // RFC 5321 max email length
    .withMessage("Email is too long")
    .normalizeEmail({ // Normalize: lowercase + remove dots in Gmail, etc.
        gmail_remove_dots: false, // keep as-is for Gmail
        all_lowercase: true,
    });

const passwordRule = (fieldName = "password") =>
    body(fieldName)
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8, max: 128 })
        .withMessage("Password must be between 8 and 128 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[@$!%*?&_\-#^]/)
        .withMessage("Password must contain at least one special character (@$!%*?&_-#^)");

const confirmPasswordRule = body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    });

// ─── Validation chains ───────────────────────────────────────────────────────

const registerValidation = [
    nameRule,
    emailRule,
    passwordRule("password"),
    confirmPasswordRule,
];

const loginValidation = [
    emailRule,
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ max: 128 }) // Prevent DoS — no strength checks needed on login
        .withMessage("Invalid credentials"),
];

const changePasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    passwordRule("newPassword"),
    body("confirmNewPassword")
        .notEmpty()
        .withMessage("Please confirm your new password")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("Passwords do not match");
            }
            if (value === req.body.currentPassword) {
                throw new Error("New password must differ from current password");
            }
            return true;
        }),
];

// ─── Centralized error handler middleware ────────────────────────────────────

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }

    next();
};

// ─── Exports ─────────────────────────────────────────────────────────────────

module.exports = {
    registerValidation,
    loginValidation,
    changePasswordValidation,
    handleValidationErrors,
};