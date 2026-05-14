const express = require("express");
const router = express.Router();

const { getAllOrphan, getOrphanById, createOrphan, updateOrphan, deleteOrphan } = require("../controllers/orphanController");

// Get all orphan /api/orphans
router.get("/", getAllOrphan);  

// Get an orphan By Id /api/orphans/:id
router.get("/:id", getOrphanById);

// creat an Orphan /api/admin/orphans
router.post("/", createOrphan);

// Update an orphan /api/admin/orphans/:id
router.put("/:id", updateOrphan);   

// Delete an orphan /api/admin/orphans/:id
router.delete("/:id", deleteOrphan);   

module.exports = router;

