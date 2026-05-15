const sponsorshipService = require("../services/sponsorshipService");
const { sponsorshipSchema, sponsorshipUpdateSchema, sponsorshipStatusSchema } = require("../schemas/sponsorshipSchema");
const { getClientErrorMessage } = require("../utils/errorMessage");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const getAllSponsorships = async (req, res) => {
  try {
    const sponsorships = await sponsorshipService.getAll();
    return sendSuccess(res, sponsorships);
  } catch (error) {
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const getSponsorshipById = async (req, res) => {
  try {
    const sponsorship = await sponsorshipService.getById(req.params.id);
    if (!sponsorship) {
      return sendError(res, "الكفالة غير موجودة", 404);
    }
    return sendSuccess(res, sponsorship);
  } catch (error) {
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const getSponsorshipsBySponsor = async (req, res) => {
  try {
    const sponsorships = await sponsorshipService.getBySponsorId(req.params.sponsorId);
    return sendSuccess(res, sponsorships);
  } catch (error) {
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const createSponsorship = async (req, res) => {
  try {
    const validatedData = sponsorshipSchema.parse(req.body);
    const sponsorship = await sponsorshipService.create(validatedData);
    return sendSuccess(res, sponsorship, "تم إنشاء الكفالة بنجاح", 201);
  } catch (error) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation Error", 400, error.issues || []);
    }
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const updateSponsorship = async (req, res) => {
  try {
    const validatedData = sponsorshipUpdateSchema.parse(req.body);
    const sponsorship = await sponsorshipService.update(req.params.id, validatedData);
    return sendSuccess(res, sponsorship);
  } catch (error) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation Error", 400, error.issues || []);
    }
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const deleteSponsorship = async (req, res) => {
  try {
    await sponsorshipService.remove(req.params.id);
    return sendSuccess(res, null, "تم حذف الكفالة بنجاح");
  } catch (error) {
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const updateSponsorshipStatus = async (req, res) => {
  try {
    const validatedData = sponsorshipStatusSchema.parse(req.body);
    const sponsorship = await sponsorshipService.updateStatus(
      req.params.id,
      validatedData.status
    );
    return sendSuccess(res, sponsorship);
  } catch (error) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation Error", 400, error.issues || []);
    }
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

module.exports = {
  getAllSponsorships,
  getSponsorshipById,
  getSponsorshipsBySponsor,
  createSponsorship,
  updateSponsorship,
  deleteSponsorship,
  updateSponsorshipStatus,
};
