const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.get("/", dashboardController.getDashboardSummary);

module.exports = router;
