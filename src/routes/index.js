const express = require("express");
const { sendSuccess } = require("../utils/apiResponse");
const authRoutes = require("./authRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const helpRequestRoutes = require("./helpRequestRoutes");
const sponsorRoutes = require("./SponsorRoutes");
const sponsorShipRoutes = require("./SponsorShipRoutes");


const router = express.Router();

router.get("/", (req, res) => {
  return sendSuccess(res, {
    name: "OrphanCenter API",
    version: "1.0.0",
  });
});

router.use("/auth", authRoutes);
router.use("/admin/dashboard", dashboardRoutes);
router.use("/help-requests", helpRequestRoutes);
router.use("/sponsors", sponsorRoutes);
router.use("/sponsorships", sponsorShipRoutes);

module.exports = router;
