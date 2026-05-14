const express = require("express");
const { sendSuccess } = require("../utils/apiResponse");

const authRoutes = require("./authRoutes");
const socialAuthRoutes = require("./socialAuthRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

const helpRequestRoutes = require("./helpRequestRoutes");
const orphanRoutes = require("./orphanRoutes");
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

router.use("/donations", donationRoutes.publicRouter);

// PUBLIC
router.use("/auth", authRoutes);
router.use("/auth", socialAuthRoutes);

router.use("/help-requests", helpRequestRoutes);
router.use("/orphans", orphanRoutes);

router.use("/sponsors", sponsorRoutes);
router.use("/sponsorships", sponsorShipRoutes);

// ADMIN
router.use("/admin/dashboard", requireAuth, requireAdmin, dashboardRoutes);
router.use("/admin/help-requests", requireAuth, requireAdmin, helpRequestAdminRoutes);
router.use("/admin/donations", requireAuth, requireAdmin, donationRoutes.adminRouter);
router.use("/sponsorship-requests", sponsorshipRequestRoutes);

module.exports = router;
