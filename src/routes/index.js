const express = require("express");
const { sendSuccess } = require("../utils/apiResponse");

const dashboardRoutes = require("./dashboardRoutes");
const helpRequestRoutes = require("./helpRequestRoutes");
const helpRequestAdminRoutes = require("./helpRequestAdminRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  return sendSuccess(res, {
    name: "OrphanCenter API",
    version: "1.0.0",
  });
});

// PUBLIC
router.use("/help-requests", helpRequestRoutes);

// ADMIN
router.use("/admin/help-requests", helpRequestAdminRoutes);

module.exports = router;