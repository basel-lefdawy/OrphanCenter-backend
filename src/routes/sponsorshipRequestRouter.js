const express = require("express");
const router = express.Router();

const {
  getAllSponsorshipRequests,
  getSponsorshipRequestById,
  createSponsorshipRequest,
  updateSponsorshipRequest,
  deleteSponsorshipRequest,
  updateSponsorshipRequestStatus,
  approveSponsorshipRequest,
} = require("../controllers/sponsorshipRequestController");

// ─── Sponsorship Request Routes ────────────────────────────
router.get("/", getAllSponsorshipRequests);                        // GET    /sponsorship-requests
router.get("/:id", getSponsorshipRequestById);                    // GET    /sponsorship-requests/:id
router.post("/", createSponsorshipRequest);                       // POST   /sponsorship-requests
router.put("/:id", updateSponsorshipRequest);                     // PUT    /sponsorship-requests/:id
router.delete("/:id", deleteSponsorshipRequest);                  // DELETE /sponsorship-requests/:id
router.patch("/:id/status", updateSponsorshipRequestStatus);      // PATCH  /sponsorship-requests/:id/status
router.patch("/:id/approve", approveSponsorshipRequest);          // PATCH  /sponsorship-requests/:id/approve

module.exports = router;