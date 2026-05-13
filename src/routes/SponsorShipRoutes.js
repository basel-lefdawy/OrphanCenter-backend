const express = require("express");
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
router.get("/", getAllSponsorships);                       // GET    /sponsorships
router.get("/:id", getSponsorshipById);                   // GET    /sponsorships/:id
router.post("/", createSponsorship);                      // POST   /sponsorships
router.put("/:id", updateSponsorship);                    // PUT    /sponsorships/:id
router.delete("/:id", deleteSponsorship);                 // DELETE /sponsorships/:id
router.patch("/:id/status", updateSponsorshipStatus);     // PATCH  /sponsorships/:id/status

module.exports = router;