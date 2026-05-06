const express = require("express");
const { sendSuccess } = require("../utils/apiResponse");

const router = express.Router();

router.get("/", (req, res) => {
  return sendSuccess(res, {
    name: "OrphanCenter API",
    version: "1.0.0",
  });
});

// Add feature routes here as modules are implemented.
// Example:
// router.use("/admin/orphans", require("./orphansRoutes"));

module.exports = router;
