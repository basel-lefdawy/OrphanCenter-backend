const express = require("express");
const validate = require("../middleware/validate");
const requireAuth = require("../middleware/requireAuth");

const {
  sponsorshipRequestSchema,
} = require("../schemas/sponsorshipRequestSchema");

const {
  createSponsorshipRequest,
} = require("../controllers/sponsorshipRequestController");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  validate(sponsorshipRequestSchema),
  createSponsorshipRequest
);

module.exports = router;
