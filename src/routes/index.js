const express = require("express");
const { sendSuccess } = require("../utils/apiResponse");
const dashboardRoutes = require("./dashboardRoutes");
const helpRequestRoutes = require("./helpRequestRoutes");


const router = express.Router();

router.get("/", (req, res) => {
  return sendSuccess(res, {
    name: "OrphanCenter API",
    version: "1.0.0",
  });
});

router.use("/admin/dashboard", dashboardRoutes);
router.use("/help-requests", helpRequestRoutes);

module.exports = router;
