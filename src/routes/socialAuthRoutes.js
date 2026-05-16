const express = require("express");
const { passport } = require("../config/passport");
const authController = require("../controllers/socialAuthControllers");
const requireAuth = require("../middleware/requireAuth");
const requireOAuthStrategy = require("../middleware/requireOAuthStrategy");
const router = express.Router();

// ─── Facebook ─────────────────────────────────────────────────────────────────

// redirecting to Facebook's login page
router.get(
  "/facebook",
  requireOAuthStrategy("facebook"),
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
  })
);

// after facebook redirects back to us, passport will authenticate and then call our controller
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
