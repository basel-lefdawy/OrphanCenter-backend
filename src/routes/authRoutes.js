const express = require("express");
const router = express.Router();
const {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  refresh,
  resetPassword,
} = require("../controllers/authControllers");
const validate = require("../middleware/validate");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} = require("../schemas/authSchema");

router.post("/register", validate(registerSchema), register);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

module.exports = router;