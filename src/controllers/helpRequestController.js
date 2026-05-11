const HelpRequestService = require('../services/helpRequestService');

// CREATE
const createRequest = async (req, res) => {
  try {
    const data = await HelpRequestService.create(req.body);
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET ALL
const getAllRequests = async (req, res) => {
  try {
    const data = await HelpRequestService.getAll();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET PENDING
const getPendingRequests = async (req, res) => {
  try {
    const data = await HelpRequestService.getPending();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET ONE
const getRequestById = async (req, res) => {
  try {
    const data = await HelpRequestService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// UPDATE
const updateRequest = async (req, res) => {
  try {
    const data = await HelpRequestService.update(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: "Not found" });

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE
const deleteRequest = async (req, res) => {
  try {
    const data = await HelpRequestService.delete(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// APPROVE
const approveRequest = async (req, res) => {
  try {
    const data = await HelpRequestService.approve(req.params.id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// REJECT
const rejectRequest = async (req, res) => {
  try {
    const data = await HelpRequestService.reject(req.params.id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getPendingRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  approveRequest,
  rejectRequest
};