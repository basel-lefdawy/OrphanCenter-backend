const express = require("express");
const router = express.Router();

const { getAllOrphan, getOrphanById, createOrphan, updateOrphan, deleteOrphan } = require("../controllers/orphanController");

// Get all orphan /api/orphans
router.get("/", getAllOrphan);  

// Get an orphan By Id /api/orphans/:id
router.get("/:id", getOrphanById);



module.exports = router;

