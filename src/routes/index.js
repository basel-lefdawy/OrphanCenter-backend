const express = require("express");
const { sendSuccess } = require("../utils/apiResponse");
const dashboardRoutes = require("./dashboardRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  return sendSuccess(res, {
    name: "OrphanCenter API",
    version: "1.0.0",
  });
});

router.use("/admin/dashboard", dashboardRoutes);

module.exports = router;
