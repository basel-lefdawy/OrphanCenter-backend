const express = require("express");
const router = express.Router();

const {
  getAllSponsors,
  getSponsorById,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  updateSponsorStatus,
} = require("../controllers/sponsorController");

const {
  getSponsorshipsBySponsor,
} = require("../controllers/sponsorshipController");

// ─── Sponsor Routes ────────────────────────────────────────
router.get("/", getAllSponsors);                         // GET    /sponsors
router.get("/:id", getSponsorById);                     // GET    /sponsors/:id
router.post("/", createSponsor);                        // POST   /sponsors
router.put("/:id", updateSponsor);                      // PUT    /sponsors/:id
router.delete("/:id", deleteSponsor);                   // DELETE /sponsors/:id
router.patch("/:id/status", updateSponsorStatus);       // PATCH  /sponsors/:id/status

// ─── كفالات كفيل معين ──────────────────────────────────────
router.get("/:sponsorId/sponsorships", getSponsorshipsBySponsor); // GET /sponsors/:sponsorId/sponsorships

module.exports = router;