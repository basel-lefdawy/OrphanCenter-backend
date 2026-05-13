const express = require("express");
const router = express.Router();

const { getAllOrphan, getOrphanById, CreatOrphan, UpdateOrphan, DeleteOrphan } = require("../controllers/orphanController");

// Get all orphan /api/orphans
router.get("/", getAllOrphan);  

// Get an orphan By Id /api/orphans/:id
router.get("/:id " , getOrphanById)

// creat an Orphan /api/admin/orphans
router.post("/", CreatOrphan);

// Update an orphan /api/admin/orphans/:id
router.put("/:id", UpdateOrphan);   

// Delete an orphan /api/admin/orphans/:id
router.delete("/:id", DeleteOrphan);   

