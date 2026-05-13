const express = require("express");

const {
  createRequest,
  getAllRequests,
  getRequestById,
} = require("../controllers/helpRequestController");

const validate = require("../middleware/validate");
const { helpRequestSchema } = require("../schemas/helpRequestSchema");

const router = express.Router();

// CREATE (Public)
router.post("/", validate(helpRequestSchema), createRequest);

// GET ALL (Public)
router.get("/", getAllRequests);

// GET ONE (Public)
router.get("/:id", getRequestById);

module.exports = router;