// routes/socialAuth.routes.js
const express = require("express");
const { passport } = require("../config/passport");
const authController = require("../controllers/socialAuthControllers");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

const clientLoginUrl = () =>
  `${(process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "")}/login`;

// ─── Facebook ─────────────────────────────────────────────────────────────────

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: clientLoginUrl(),
    session: false,
  }),
  authController.facebookCallback
);

// ─── Google ───────────────────────────────────────────────────────────────────

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: clientLoginUrl(),
    session: false,
  }),
  authController.googleCallback
);

// ─── Current User ─────────────────────────────────────────────────────────────

router.get("/me", requireAuth, authController.getCurrentUser);

module.exports = router;