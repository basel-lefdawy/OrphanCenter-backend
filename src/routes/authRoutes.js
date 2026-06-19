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
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} = require("../schemas/authSchema");

const attachRefreshToken = (req, res, next) => {
  if (!req.body.refreshToken) {
    const headerToken = req.headers["x-refresh-token"];
    if (headerToken) {
      req.body.refreshToken = headerToken;
    }
  }
  return next();
};

router.post("/register", validate(registerSchema), register);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", attachRefreshToken, validate(refreshTokenSchema), refresh);
router.post("/logout", attachRefreshToken, validate(refreshTokenSchema), logout);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

module.exports = router;