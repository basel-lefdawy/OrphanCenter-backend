const express = require("express");
const validate = require("../middleware/validate");
const { sponsorSchema, sponsorStatusSchema } = require("../schemas/sponsorSchema");
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

// ─── كفالات كفيل معين ──────────────────────────────────────
router.get("/:sponsorId/sponsorships", getSponsorshipsBySponsor); 

// ─── Sponsor Routes ────────────────────────────────────────
router.get("/", getAllSponsors);                        
router.get("/:id", getSponsorById);                    
router.post("/", validate(sponsorSchema), createSponsor);                        
router.put("/:id", validate(sponsorSchema.partial()), updateSponsor);                
router.delete("/:id", deleteSponsor);                  
router.patch("/:id/status", validate(sponsorStatusSchema), updateSponsorStatus);
module.exports = router;