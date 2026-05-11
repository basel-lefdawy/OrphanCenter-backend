const express = require("express");
const { passport } = require("../config/passport");
const authController = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

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
    failureRedirect: "/login",
    session: false,
  }),
  authController.facebookCallback
);

router.get("/me", requireAuth, authController.getCurrentUser);

module.exports = router;
