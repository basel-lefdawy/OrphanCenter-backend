const express = require("express");

const {
  createRequest,
} = require("../controllers/helpRequestController");

const validate = require("../middleware/validate");
const { helpRequestSchema } = require("../schemas/helpRequestSchema");

const router = express.Router();

// CREATE (Public)
router.post("/", validate(helpRequestSchema), createRequest);

module.exports = router;
