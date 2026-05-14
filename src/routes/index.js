const express = require("express");
const { sendSuccess } = require("../utils/apiResponse");

const authRoutes = require("./authRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const helpRequestRoutes = require("./helpRequestRoutes");
const helpRequestAdminRoutes = require("./helpRequestAdminRoutes");
const donationRoutes = require("./donationRoutes");

// const donationRoutes = require("./donationRoutes");
// const adminDonationRoutes = require("./adminDonationRoutes");


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
router.use("/admin/dashboard", dashboardRoutes);
router.use("/help-requests", helpRequestRoutes);

<<<<<<< Updated upstream
// ADMIN
router.use("/admin/help-requests", helpRequestAdminRoutes);
=======
router.use("/sponsors", sponsorRoutes);

router.use("/sponsorships", sponsorShipRoutes);

// router.use("/donations", donationRoutes);

// ADMIN
router.use("/admin/dashboard", dashboardRoutes);

router.use("/admin/help-requests",helpRequestAdminRoutes);

// router.use("/admin/donations", adminDonationRoutes);

>>>>>>> Stashed changes

module.exports = router;