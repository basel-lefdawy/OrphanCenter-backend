const sponsorService = require("../services/sponsorService");
const { sponsorSchema, sponsorStatusSchema } = require("../schemas/sponsorSchema");
const { getClientErrorMessage } = require("../utils/errorMessage");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const getAllSponsors = async (req, res) => {
  try {
    const sponsors = await sponsorService.getAll();
    return sendSuccess(res, sponsors);
  } catch (error) {
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const getSponsorById = async (req, res) => {
  try {
    const sponsor = await sponsorService.getById(req.params.id);
    if (!sponsor) {
      return sendError(res, "الكفيل غير موجود", 404);
    }
    return sendSuccess(res, sponsor);
  } catch (error) {
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const createSponsor = async (req, res) => {
  try {
    const validatedData = sponsorSchema.parse(req.body);
    const sponsor = await sponsorService.create(validatedData);
    return sendSuccess(res, sponsor, "تم إنشاء الكفيل بنجاح", 201);
  } catch (error) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation Error", 400, error.issues || []);
    }
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const updateSponsor = async (req, res) => {
  try {
    const validatedData = sponsorSchema.partial().parse(req.body);
    const sponsor = await sponsorService.update(req.params.id, validatedData);
    return sendSuccess(res, sponsor);
  } catch (error) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation Error", 400, error.issues || []);
    }
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const deleteSponsor = async (req, res) => {
  try {
    await sponsorService.remove(req.params.id);
    return sendSuccess(res, null, "تم حذف الكفيل بنجاح");
  } catch (error) {
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const updateSponsorStatus = async (req, res) => {
  try {
    const validatedData = sponsorStatusSchema.parse(req.body);
    const sponsor = await sponsorService.updateStatus(req.params.id, validatedData.status);
    return sendSuccess(res, sponsor);
  } catch (error) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation Error", 400, error.issues || []);
    }
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

module.exports = {
  getAllSponsors,
  getSponsorById,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  updateSponsorStatus,
};
