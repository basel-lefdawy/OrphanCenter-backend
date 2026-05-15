const express = require("express");
const validate = require("../middleware/validate");
const { sponsorshipRequestSchema } = require("../schemas/sponsorshipRequestSchema");
const { createSponsorshipRequest } = require("../controllers/sponsorshipRequestController");

const router = express.Router();

router.post("/", validate(sponsorshipRequestSchema), createSponsorshipRequest);

module.exports = router;