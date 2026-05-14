const express = require("express");
const { passport } = require("../config/passport");
const authController = require("../controllers/socialAuthControllers");
const requireAuth = require("../middleware/requireAuth");
const { sendError } = require("../utils/apiResponse");
const router = express.Router();

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
  (req, res, next) => {
    passport.authenticate("facebook", { session: false }, (err, user) => {
      // Whether passport succeeded or failed, hand off to the controller.
      // req.user = null triggers the error redirect inside handleOAuthCallback.
      req.user = user || null;
      authController.facebookCallback(req, res, next);
    })(req, res, next);
  }
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
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user) => {
      // Whether passport succeeded or failed, hand off to the controller.
      // req.user = null triggers the error redirect inside handleOAuthCallback.
      req.user = user || null;
      authController.googleCallback(req, res, next);
    })(req, res, next);
  }
);

// ─── Current User ─────────────────────────────────────────────────────────────
router.get("/me", requireAuth, authController.getCurrentUser);

module.exports = router;