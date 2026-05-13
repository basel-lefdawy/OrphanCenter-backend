const express = require("express");

const {
  getAllRequests,
  getPendingRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  approveRequest,
  rejectRequest,
} = require("../controllers/helpRequestController");

const router = express.Router();

// GET ALL (Admin)
router.get("/", getAllRequests);

// GET PENDING (Admin)
router.get("/pending", getPendingRequests);

// GET ONE (Admin)
router.get("/:id", getRequestById);

// UPDATE (Admin)
router.patch("/:id", updateRequest);

// DELETE (Admin)
router.delete("/:id", deleteRequest);

// APPROVE (Admin)
router.patch("/:id/approve", approveRequest);

// REJECT (Admin)
router.patch("/:id/reject", rejectRequest);

module.exports = router;