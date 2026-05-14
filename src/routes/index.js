const express = require("express");
const { sendSuccess } = require("../utils/apiResponse");

const authRoutes = require("./authRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

const helpRequestRoutes = require("./helpRequestRoutes");
const helpRequestAdminRoutes = require("./helpRequestAdminRoutes");
const donationRoutes = require("./donationRoutes");
const sponsorshipRequestRoutes = require("./sponsorshipRequestRouter");
const sponsorRoutes = require("./SponsorRoutes");
const sponsorShipRoutes = require("./SponsorShipRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  return sendSuccess(res, {
    name: "OrphanCenter API",
    version: "1.0.0",
  });
});

router.use("/donations", donationRoutes);

// PUBLIC
router.use("/auth", authRoutes);

router.use("/help-requests", helpRequestRoutes);

router.use("/sponsors", sponsorRoutes);

router.use("/sponsorships", sponsorShipRoutes);

// ADMIN
router.use("/admin/dashboard", requireAuth, requireAdmin, dashboardRoutes);

router.use("/admin/help-requests", requireAuth, requireAdmin, helpRequestAdminRoutes);
router.use("/sponsorship-requests", sponsorshipRequestRoutes);

module.exports = router;
