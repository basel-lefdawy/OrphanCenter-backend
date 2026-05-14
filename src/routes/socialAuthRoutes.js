// routes/socialAuth.routes.js
const express = require("express");
const { passport } = require("../config/passport");
const authController = require("../controllers/socialAuthControllers");
const requireAuth = require("../middleware/requireAuth");
const { sendError } = require("../utils/apiResponse");

const router = express.Router();

const clientLoginUrl = () =>
  `${(process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "")}/login`;

const requireOAuthStrategy = (strategyName) => (req, res, next) => {
  if (!passport._strategy(strategyName)) {
    return sendError(
      res,
      `${strategyName} OAuth is not configured on the server.`,
      503
    );
  }

  return next();
};

// ─── Facebook ─────────────────────────────────────────────────────────────────

router.get(
  "/facebook",
  requireOAuthStrategy("facebook"),
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
  })
);

router.get(
  "/facebook/callback",
  requireOAuthStrategy("facebook"),
  passport.authenticate("facebook", {
    failureRedirect: clientLoginUrl(),
    session: false,
  }),
  authController.facebookCallback
);

// ─── Google ───────────────────────────────────────────────────────────────────

router.get(
  "/google",
  requireOAuthStrategy("google"),
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  requireOAuthStrategy("google"),
  passport.authenticate("google", {
    failureRedirect: clientLoginUrl(),
    session: false,
  }),
  authController.googleCallback
);

// ─── Current User ─────────────────────────────────────────────────────────────

router.get("/me", requireAuth, authController.getCurrentUser);

module.exports = router;
