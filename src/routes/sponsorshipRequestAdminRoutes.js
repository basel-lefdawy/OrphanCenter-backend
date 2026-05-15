const express = require("express");
const validate = require("../middleware/validate");
const { sponsorshipRequestUpdateSchema } = require("../schemas/sponsorshipRequestSchema");
const {
  getAllSponsorshipRequests,
  getPendingSponsorshipRequests,
  getSponsorshipRequestById,
  updateSponsorshipRequest,
  deleteSponsorshipRequest,
  approveSponsorshipRequest,
  rejectSponsorshipRequest,
} = require("../controllers/sponsorshipRequestController");

const router = express.Router();

router.get("/", getAllSponsorshipRequests);
router.get("/pending", getPendingSponsorshipRequests);
router.get("/:id", getSponsorshipRequestById);
router.patch("/:id", validate(sponsorshipRequestUpdateSchema), updateSponsorshipRequest);
router.delete("/:id", deleteSponsorshipRequest);
router.patch("/:id/approve", approveSponsorshipRequest);
router.patch("/:id/reject", rejectSponsorshipRequest);

module.exports = router;
