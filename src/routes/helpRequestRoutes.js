const express = require("express");

const {
  createRequest,
  getAllRequests,
  getPendingRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  approveRequest,
  rejectRequest,
} = require("../controllers/helpRequestController");

const validate = require("../middleware/validate");

const { helpRequestSchema } = require("../schemas/helpRequestSchema");

const router = express.Router();

// CREATE
router.post("/", validate(helpRequestSchema), createRequest);

// GET ALL
router.get("/", getAllRequests);

// GET PENDING
router.get("/pending", getPendingRequests);

// GET ONE
router.get("/:id", getRequestById);

// UPDATE
router.patch("/:id", updateRequest);

// DELETE
router.delete("/:id", deleteRequest);

// APPROVE
router.patch("/:id/approve", approveRequest);

// REJECT
router.patch("/:id/reject", rejectRequest);

module.exports = router;