const sponsorshipRequestService = require("../services/sponsorshipRequestService");
const { getClientErrorMessage } = require("../utils/errorMessage");
const { sponsorshipRequestSchema } = require("../schemas/sponsorshipRequestSchema");

const getAllSponsorshipRequests = async (req, res) => {
  try {
    const requests = await sponsorshipRequestService.getAll();
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const getSponsorshipRequestById = async (req, res) => {
  try {
    const request = await sponsorshipRequestService.getById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "طلب الكفالة غير موجود" });
    }
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const createSponsorshipRequest = async (req, res) => {
  try {
    const validatedData = sponsorshipRequestSchema.parse(req.body);
    const userId = req.user.id; // I took it from requireAuth middleware
    validatedData.userId = userId; // Attach the userId to the validated data
    const request = await sponsorshipRequestService.create(validatedData);
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const updateSponsorshipRequest = async (req, res) => {
  try {
    const validatedData = sponsorshipRequestSchema.partial().parse(req.body);
    const request = await sponsorshipRequestService.update(req.params.id, validatedData);
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const deleteSponsorshipRequest = async (req, res) => {
  try {
    await sponsorshipRequestService.remove(req.params.id);
    res.status(200).json({ success: true, message: "تم حذف طلب الكفالة بنجاح" });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const updateSponsorshipRequestStatus = async (req, res) => {
  try {
    const validatedData = sponsorshipRequestSchema.partial().parse(req.body);
    const request = await sponsorshipRequestService.updateStatus(
      req.params.id,
      validatedData.status
    );
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

// ─── Approve: ينشئ Sponsor + Sponsorship + Representative (اختياري) ───
const approveSponsorshipRequest = async (req, res) => {
  try {
    const result = await sponsorshipRequestService.approve(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

module.exports = {
  getAllSponsorshipRequests,
  getSponsorshipRequestById,
  createSponsorshipRequest,
  updateSponsorshipRequest,
  deleteSponsorshipRequest,
  updateSponsorshipRequestStatus,
  approveSponsorshipRequest,
};