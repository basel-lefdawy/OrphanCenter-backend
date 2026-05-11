const HelpRequestService = require('../services/helpRequestService');

// CREATE
async function createRequest (req, res){
  try {
    const data = await HelpRequestService.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
async function getAllRequests (req, res) {
  try {
    const data = await HelpRequestService.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PENDING
async function getPendingRequests (req, res){
  try {
    const data = await HelpRequestService.getPending();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE
async function getRequestById (req, res) {
  try {
    const data = await HelpRequestService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
async function updateRequest (req, res) {
  try {
    const data = await HelpRequestService.update(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
async function deleteRequest (req, res) {
  try {
    const data = await HelpRequestService.delete(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// APPROVE
async function approveRequest (req, res) {
  try {
    const data = await HelpRequestService.approve(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REJECT
async function rejectRequest (req, res) {
  try {
    const data = await HelpRequestService.reject(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports={
  createRequest,
  getAllRequests,
  getPendingRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  approveRequest,
  rejectRequest
}