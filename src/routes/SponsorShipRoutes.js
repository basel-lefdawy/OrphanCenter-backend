const express = require("express");
const validate = require("../middleware/validate");
const { sponsorshipSchema, sponsorshipUpdateSchema, sponsorshipStatusSchema } = require("../schemas/sponsorshipSchema");
const router = express.Router();

const {
  getAllSponsorships,
  getSponsorshipById,
  createSponsorship,
  updateSponsorship,
  deleteSponsorship,
  updateSponsorshipStatus,
} = require("../controllers/sponsorshipController");

// ─── Sponsorship Routes ────────────────────────────────────
router.get("/", getAllSponsorships);
router.get("/:id", getSponsorshipById);
router.post("/", validate(sponsorshipSchema), createSponsorship);
router.put("/:id", validate(sponsorshipUpdateSchema), updateSponsorship);
router.delete("/:id", deleteSponsorship);
module.exports = router;